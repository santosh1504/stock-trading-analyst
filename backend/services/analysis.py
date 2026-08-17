from typing import Optional
from models import AnalyzeResponse
from tools import get_stock_price, get_price_history, calculate_rsi, get_sma
from agent import analyze_stock_with_ai
from utils.validators import validate_and_clean_ticker, sanitize_question

async def run_analysis(ticker: str, question: Optional[str] = None) -> AnalyzeResponse:
    """
    Run complete stock analysis pipeline:
    1. Validate ticker
    2. Fetch current price
    3. Fetch 10-day price history
    4. Calculate RSI
    5. Fetch 50/200 SMA
    6. Get Gemini AI analysis
    7. Return structured response
    """
    # Step 1: Validate ticker
    clean_ticker = validate_and_clean_ticker(ticker)
    clean_question = sanitize_question(question or '')
    
    # Step 2: Fetch current price
    price_data = get_stock_price(clean_ticker)
    current_price = price_data['price']
    
    # Step 3: Fetch price history
    history_data = get_price_history(clean_ticker)
    historical_prices = history_data['prices']
    historical_dates = history_data['dates']
    
    # Step 4: Calculate RSI
    rsi_data = calculate_rsi(clean_ticker)
    rsi = rsi_data['rsi']
    rsi_status = rsi_data['status']
    
    # Step 5: Fetch SMA
    sma_data = get_sma(clean_ticker)
    sma_50 = sma_data['sma_50']
    sma_200 = sma_data['sma_200']
    trend = sma_data['trend']
    
    # Step 6: Gemini AI analysis
    ai_result = analyze_stock_with_ai(
        ticker=clean_ticker,
        current_price=current_price,
        historical_prices=historical_prices,
        historical_dates=historical_dates,
        rsi=rsi,
        rsi_status=rsi_status,
        sma_50=sma_50,
        sma_200=sma_200,
        trend=trend,
        question=clean_question or None
    )
    
    # Step 7: Return structured response
    return AnalyzeResponse(
        ticker=clean_ticker,
        current_price=current_price,
        historical_prices=historical_prices,
        historical_dates=historical_dates,
        rsi=rsi,
        rsi_status=rsi_status,
        sma_50=sma_50,
        sma_200=sma_200,
        trend=trend,
        decision=ai_result['decision'],
        confidence=ai_result['confidence'],
        rationale=ai_result['rationale']
    )
