import re
from typing import List, Optional, Dict, Any
from models import ChatResponse, ChatMessage
from tools import get_stock_price, calculate_rsi, get_sma
from agent import chat_with_ai
from utils.validators import validate_and_clean_ticker

# Common stock ticker patterns in questions
TICKER_PATTERN = re.compile(r'\b([A-Z]{1,5})\b')

# Keywords that suggest real market data is needed
MARKET_KEYWORDS = [
    'price', 'rsi', 'sma', 'moving average', 'bullish', 'bearish',
    'buy', 'sell', 'hold', 'trend', 'technical', 'analysis',
    'stock', 'overbought', 'oversold', 'golden cross', 'death cross',
    'should i', 'what is', 'how is', 'compare'
]

# Common English words that look like tickers (to exclude)
COMMON_WORDS = {
    'I', 'A', 'AN', 'THE', 'IS', 'ARE', 'WAS', 'BE', 'BY', 'OR',
    'AND', 'FOR', 'IN', 'ON', 'AT', 'TO', 'DO', 'IT', 'US', 'OF',
    'IF', 'SO', 'AS', 'GO', 'NO', 'UP', 'MY', 'WE', 'HE', 'AM',
    'CAN', 'GET', 'BUY', 'HOW', 'WHY', 'WHO', 'NOW', 'NEW', 'ALL'
}


def _extract_tickers(message: str) -> list:
    """Extract potential stock ticker symbols from a message."""
    # Look for known patterns: 'AAPL stock', 'Apple (AAPL)', etc.
    tickers = []
    
    # Match uppercase words of 1-5 chars
    matches = TICKER_PATTERN.findall(message.upper())
    
    for match in matches:
        if match not in COMMON_WORDS and len(match) >= 2:
            tickers.append(match)
    
    return list(dict.fromkeys(tickers))  # deduplicate preserving order


def _needs_market_data(message: str) -> bool:
    """Determine if the message requires real market data."""
    message_lower = message.lower()
    return any(keyword in message_lower for keyword in MARKET_KEYWORDS)


async def run_chat(
    message: str,
    history: Optional[List[Dict]] = None
) -> ChatResponse:
    """
    Handle a chat message, fetching real market data if needed.
    """
    history = history or []
    sources_used = []
    market_data = None
    
    # Determine if we need real market data
    if _needs_market_data(message):
        potential_tickers = _extract_tickers(message)
        
        # Try to get data for the first recognized ticker
        for ticker_candidate in potential_tickers[:1]:  # Limit to first ticker
            try:
                clean_ticker = validate_and_clean_ticker(ticker_candidate)
                
                # Fetch key data points
                price_data = get_stock_price(clean_ticker)
                rsi_data = calculate_rsi(clean_ticker)
                sma_data = get_sma(clean_ticker)
                
                market_data = {
                    'ticker': clean_ticker,
                    'current_price': price_data['price'],
                    'rsi': rsi_data['rsi'],
                    'rsi_status': rsi_data['status'],
                    'sma_50': sma_data['sma_50'],
                    'sma_200': sma_data['sma_200'],
                    'trend': sma_data['trend'],
                    'decision': 'N/A',  # Not running full analysis in chat
                    'confidence': 'N/A'
                }
                sources_used.append(f"Twelve Data: {clean_ticker} live market data")
                sources_used.append("Google Gemini 2.5 Flash")
                break
            except Exception:
                continue  # Try next ticker or fall through to general chat
    
    if not sources_used:
        sources_used.append("Google Gemini 2.5 Flash")
    
    # Get AI response
    reply = chat_with_ai(message, history, market_data)
    
    return ChatResponse(
        reply=reply,
        sources_used=sources_used
    )
