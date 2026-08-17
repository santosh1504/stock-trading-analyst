import asyncio
from models import CompareResponse, AnalyzeResponse
from services.analysis import run_analysis
from agent import chat_with_ai
from utils.validators import validate_and_clean_ticker
from utils.errors import AIAnalysisError

async def run_comparison(ticker1: str, ticker2: str) -> CompareResponse:
    """
    Compare two stocks by running full analysis on both and
    determining which is technically stronger using real data.
    """
    clean_t1 = validate_and_clean_ticker(ticker1)
    clean_t2 = validate_and_clean_ticker(ticker2)
    
    if clean_t1 == clean_t2:
        from utils.errors import APIError
        raise APIError("Please provide two different ticker symbols for comparison.", 400)
    
    # Run both analyses concurrently
    results = await asyncio.gather(
        run_analysis(clean_t1),
        run_analysis(clean_t2),
        return_exceptions=True
    )
    
    # Check for exceptions
    for i, result in enumerate(results):
        if isinstance(result, Exception):
            raise result
    
    stock1: AnalyzeResponse = results[0]
    stock2: AnalyzeResponse = results[1]
    
    # Determine technically stronger stock using scoring
    score1 = _compute_technical_score(stock1)
    score2 = _compute_technical_score(stock2)
    
    if score1 > score2:
        stronger = clean_t1
    elif score2 > score1:
        stronger = clean_t2
    else:
        # Tie-breaker: prefer the one with BUY decision
        if stock1.decision == 'BUY' and stock2.decision != 'BUY':
            stronger = clean_t1
        elif stock2.decision == 'BUY' and stock1.decision != 'BUY':
            stronger = clean_t2
        else:
            stronger = clean_t1  # True tie: pick first
    
    # Generate comparison rationale with AI
    comparison_rationale = _generate_comparison_rationale(stock1, stock2, stronger)
    
    return CompareResponse(
        stock1=stock1,
        stock2=stock2,
        stronger_stock=stronger,
        comparison_rationale=comparison_rationale
    )


def _compute_technical_score(stock: AnalyzeResponse) -> float:
    """Compute a technical score for a stock based on its indicators."""
    score = 0.0
    
    # RSI scoring: Neutral RSI is ideal (40-60 range), oversold can be opportunity
    if 40 <= stock.rsi <= 60:
        score += 3.0  # Perfect neutral zone
    elif 30 <= stock.rsi < 40 or 60 < stock.rsi <= 70:
        score += 2.0  # Slightly elevated but manageable
    elif stock.rsi < 30:
        score += 1.0  # Oversold - potential opportunity but risky
    else:
        score += 0.0  # Overbought - risky
    
    # SMA trend scoring
    if 'Golden Cross' in stock.trend or 'Bullish' in stock.trend:
        score += 4.0
    else:
        score += 0.0
    
    # Decision scoring
    if stock.decision == 'BUY':
        score += 3.0
    elif stock.decision == 'HOLD':
        score += 1.5
    else:
        score += 0.0
    
    # Confidence scoring
    if stock.confidence == 'High':
        score += 2.0
    elif stock.confidence == 'Medium':
        score += 1.0
    else:
        score += 0.0
    
    return score


def _generate_comparison_rationale(stock1: AnalyzeResponse, stock2: AnalyzeResponse, stronger: str) -> str:
    """Generate a comparison rationale based on real indicator data."""
    s1 = stock1.ticker
    s2 = stock2.ticker
    
    rationale_parts = []
    
    # RSI comparison
    rationale_parts.append(
        f"RSI Analysis: {s1} has RSI {stock1.rsi:.1f} ({stock1.rsi_status}) vs "
        f"{s2} RSI {stock2.rsi:.1f} ({stock2.rsi_status})."
    )
    
    # Trend comparison
    rationale_parts.append(
        f"Trend: {s1} shows {stock1.trend}, while {s2} shows {stock2.trend}."
    )
    
    # SMA comparison
    rationale_parts.append(
        f"Moving Averages: {s1} 50-SMA ${stock1.sma_50:.2f} / 200-SMA ${stock1.sma_200:.2f}; "
        f"{s2} 50-SMA ${stock2.sma_50:.2f} / 200-SMA ${stock2.sma_200:.2f}."
    )
    
    # Decision comparison
    rationale_parts.append(
        f"AI Decisions: {s1} → {stock1.decision} ({stock1.confidence} confidence); "
        f"{s2} → {stock2.decision} ({stock2.confidence} confidence)."
    )
    
    # Conclusion
    rationale_parts.append(
        f"Based on combined technical scoring across RSI, SMA trend, AI decision, and confidence, "
        f"{stronger} demonstrates stronger technical momentum. This is educational analysis only — "
        f"past performance does not guarantee future results."
    )
    
    return ' '.join(rationale_parts)
