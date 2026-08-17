import os
import json
import re
from typing import Dict, Any, Optional
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
from utils.errors import AIAnalysisError

load_dotenv()

SYSTEM_PROMPT = """You are an expert stock market technical analyst AI. Your role is to analyze stock market data and provide educational investment insights.

You analyze real technical indicators including:
- Current stock price
- 10-day price history
- RSI (Relative Strength Index): >70 Overbought, <30 Oversold, otherwise Neutral
- 50-day SMA and 200-day SMA
- Golden Cross (50 SMA > 200 SMA = Bullish) or Death Cross (50 SMA < 200 SMA = Bearish)

You provide:
- A clear BUY, SELL, or HOLD decision
- Confidence level: High, Medium, or Low
- Educational rationale explaining the technical analysis

IMPORTANT RULES:
- Always base your analysis on the real data provided
- Never guarantee investment returns or future prices
- Always include a disclaimer that this is educational analysis only
- Be specific about which indicators support your decision
- Consider ALL indicators holistically, not just one"""

def _get_llm() -> ChatGoogleGenerativeAI:
    api_key = os.getenv("GEMINI_API_KEY", "")
    if not api_key:
        raise AIAnalysisError("GEMINI_API_KEY is not configured")

    # langchain-google-genai 2.x picks up GOOGLE_API_KEY automatically
    os.environ["GOOGLE_API_KEY"] = api_key

    return ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0.3,
    )

def analyze_stock_with_ai(
    ticker: str,
    current_price: float,
    historical_prices: list,
    historical_dates: list,
    rsi: float,
    rsi_status: str,
    sma_50: float,
    sma_200: float,
    trend: str,
    question: Optional[str] = None
) -> Dict[str, Any]:
    """
    Use Google Gemini to analyze stock technical indicators and return
    a structured BUY/SELL/HOLD decision with confidence and rationale.
    """
    price_change = ""
    if len(historical_prices) >= 2:
        change = historical_prices[-1] - historical_prices[0]
        pct_change = (change / historical_prices[0]) * 100
        price_change = f"10-day price change: {change:+.2f} ({pct_change:+.1f}%)"
    
    analysis_prompt = f"""Analyze the following real market data for {ticker} and provide your technical analysis:

STOCK: {ticker}
Current Price: ${current_price:.2f}
{price_change}
10-Day Price History (oldest to newest): {historical_prices}
10-Day Dates: {historical_dates}

TECHNICAL INDICATORS:
- RSI (14-day): {rsi:.2f} → Status: {rsi_status}
- 50-Day SMA: ${sma_50:.4f}
- 200-Day SMA: ${sma_200:.4f}
- Trend Signal: {trend}

{f'User Question: {question}' if question else 'Provide a general technical analysis.'}

Respond in this EXACT JSON format (no markdown, no extra text, just valid JSON):
{{
  "decision": "BUY",
  "confidence": "Medium",
  "rationale": "Your detailed 3-5 sentence educational rationale here. Explain each indicator and how they collectively support the decision. End with a disclaimer about educational use only."
}}

Decision must be exactly: BUY, SELL, or HOLD
Confidence must be exactly: High, Medium, or Low"""
    
    try:
        llm = _get_llm()
        messages = [
            SystemMessage(content=SYSTEM_PROMPT),
            HumanMessage(content=analysis_prompt)
        ]
        
        response = llm.invoke(messages)
        response_text = response.content.strip()
        
        # Extract JSON from response (handle markdown code blocks if present)
        json_match = re.search(r'\{[\s\S]*\}', response_text)
        if not json_match:
            raise AIAnalysisError("AI response did not contain valid JSON")
        
        result = json.loads(json_match.group())
        
        # Validate required fields
        decision = result.get('decision', '').upper()
        confidence = result.get('confidence', '').capitalize()
        rationale = result.get('rationale', '')
        
        if decision not in ['BUY', 'SELL', 'HOLD']:
            raise AIAnalysisError(f"Invalid AI decision: {decision}")
        
        if confidence not in ['High', 'Medium', 'Low']:
            confidence = 'Medium'  # Default to Medium if invalid
        
        if not rationale or len(rationale) < 10:
            raise AIAnalysisError("AI rationale is missing or too short")
        
        return {
            "decision": decision,
            "confidence": confidence,
            "rationale": rationale
        }
    
    except (AIAnalysisError):
        raise
    except json.JSONDecodeError as e:
        raise AIAnalysisError(f"Failed to parse AI response as JSON: {e}")
    except Exception as e:
        raise AIAnalysisError(f"Gemini API error: {str(e)}")


def chat_with_ai(
    message: str,
    history: list,
    market_data: Optional[Dict[str, Any]] = None
) -> str:
    """
    Handle a conversational message with optional market data context.
    Returns the AI's response string.
    """
    try:
        llm = _get_llm()
        
        chat_system = """You are an expert AI stock market analyst assistant. You help users understand stock market concepts, technical analysis, and interpret market data.

When market data is provided, use it to give specific, accurate answers.
When no market data is provided for market-specific questions, explain that you need to fetch real data first.
Always be educational and helpful. Never guarantee returns or recommend specific investment amounts.
Keep responses concise but informative (2-4 paragraphs max)."""
        
        messages = [SystemMessage(content=chat_system)]
        
        # Add conversation history
        for hist_msg in history[-6:]:  # Keep last 6 messages for context
            if hist_msg.get('role') == 'user':
                messages.append(HumanMessage(content=hist_msg['content']))
            elif hist_msg.get('role') == 'assistant':
                from langchain_core.messages import AIMessage
                messages.append(AIMessage(content=hist_msg['content']))
        
        # Add current message with market data context if available
        current_content = message
        if market_data:
            ticker = market_data.get('ticker', '')
            context = f"""
[REAL MARKET DATA FOR {ticker}]
Current Price: ${market_data.get('current_price', 'N/A')}
RSI: {market_data.get('rsi', 'N/A')} ({market_data.get('rsi_status', 'N/A')})
50-Day SMA: ${market_data.get('sma_50', 'N/A')}
200-Day SMA: ${market_data.get('sma_200', 'N/A')}
Trend: {market_data.get('trend', 'N/A')}
Decision: {market_data.get('decision', 'N/A')} ({market_data.get('confidence', 'N/A')} confidence)

User question: {message}"""
            current_content = context
        
        messages.append(HumanMessage(content=current_content))
        
        response = llm.invoke(messages)
        return response.content.strip()
    
    except AIAnalysisError:
        raise
    except Exception as e:
        raise AIAnalysisError(f"Chat AI error: {str(e)}")
