from unittest.mock import patch, AsyncMock
from models import AnalyzeResponse, CompareResponse

def make_stock(ticker, decision="HOLD", confidence="Medium", rsi=55.0, trend="Golden Cross / Bullish"):
    return AnalyzeResponse(
        ticker=ticker,
        current_price=150.0,
        historical_prices=[148.0, 149.0, 150.0, 151.0, 150.5, 149.5, 150.0, 151.5, 150.5, 150.0],
        historical_dates=["2024-01-01"] * 10,
        rsi=rsi,
        rsi_status="Neutral",
        sma_50=145.0,
        sma_200=140.0,
        trend=trend,
        decision=decision,
        confidence=confidence,
        rationale="Test rationale. Educational analysis only."
    )

def test_compare_two_stocks(client):
    mock_result = CompareResponse(
        stock1=make_stock("AAPL"),
        stock2=make_stock("MSFT"),
        stronger_stock="AAPL",
        comparison_rationale="AAPL shows stronger technical signals based on combined indicators."
    )
    with patch('main.run_comparison', new=AsyncMock(return_value=mock_result)):
        response = client.post("/api/compare", json={"ticker1": "AAPL", "ticker2": "MSFT"})
    assert response.status_code == 200
    data = response.json()
    assert data["stronger_stock"] in ["AAPL", "MSFT"]
    assert "stock1" in data
    assert "stock2" in data
    assert "comparison_rationale" in data

def test_compare_missing_ticker(client):
    response = client.post("/api/compare", json={"ticker1": "AAPL"})
    assert response.status_code == 422

def test_compare_same_ticker_rejected(client):
    from utils.errors import APIError
    with patch('main.run_comparison', new=AsyncMock(side_effect=APIError("Different tickers required", 400))):
        response = client.post("/api/compare", json={"ticker1": "AAPL", "ticker2": "AAPL"})
    assert response.status_code == 400
