from unittest.mock import patch, AsyncMock

def test_analyze_valid_ticker(client, mock_full_analysis):
    with patch('main.run_analysis', new=AsyncMock(return_value=mock_full_analysis)):
        response = client.post("/api/analyze", json={"ticker": "AAPL"})
    assert response.status_code == 200
    data = response.json()
    assert data["ticker"] == "AAPL"
    assert "current_price" in data
    assert "rsi" in data
    assert "decision" in data
    assert data["decision"] in ["BUY", "SELL", "HOLD"]
    assert data["confidence"] in ["High", "Medium", "Low"]
    assert isinstance(data["historical_prices"], list)
    assert len(data["historical_prices"]) > 0

def test_analyze_lowercase_ticker(client, mock_full_analysis):
    """Ticker should be normalized to uppercase."""
    with patch('main.run_analysis', new=AsyncMock(return_value=mock_full_analysis)):
        response = client.post("/api/analyze", json={"ticker": "aapl"})
    assert response.status_code == 200

def test_analyze_missing_ticker(client):
    response = client.post("/api/analyze", json={})
    assert response.status_code == 422

def test_analyze_empty_ticker(client):
    response = client.post("/api/analyze", json={"ticker": ""})
    assert response.status_code == 422

def test_analyze_with_question(client, mock_full_analysis):
    with patch('main.run_analysis', new=AsyncMock(return_value=mock_full_analysis)):
        response = client.post("/api/analyze", json={
            "ticker": "AAPL",
            "question": "Should I buy Apple stock?"
        })
    assert response.status_code == 200

def test_analyze_api_error_returns_clean_message(client):
    from utils.errors import InvalidTickerError
    with patch('main.run_analysis', new=AsyncMock(side_effect=InvalidTickerError('FAKE'))):
        response = client.post("/api/analyze", json={"ticker": "FAKE"})
    assert response.status_code == 422
    assert "FAKE" in response.json()["detail"]
    assert "stack" not in response.text.lower()
    assert "traceback" not in response.text.lower()

def test_analyze_response_has_all_fields(client, mock_full_analysis):
    with patch('main.run_analysis', new=AsyncMock(return_value=mock_full_analysis)):
        response = client.post("/api/analyze", json={"ticker": "AAPL"})
    data = response.json()
    required_fields = [
        'ticker', 'current_price', 'historical_prices', 'historical_dates',
        'rsi', 'rsi_status', 'sma_50', 'sma_200', 'trend',
        'decision', 'confidence', 'rationale'
    ]
    for field in required_fields:
        assert field in data, f"Missing field: {field}"
