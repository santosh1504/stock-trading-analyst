from unittest.mock import patch, MagicMock
import pytest
from tools import get_stock_price, get_price_history, calculate_rsi, get_sma
from utils.errors import InvalidTickerError, MarketDataError, RateLimitError

def make_mock_response(json_data, status_code=200):
    mock = MagicMock()
    mock.status_code = status_code
    mock.json.return_value = json_data
    return mock

class TestGetStockPrice:
    def test_valid_ticker_returns_price(self):
        mock_resp = make_mock_response({"price": "175.50"})
        with patch('tools.requests.get', return_value=mock_resp):
            result = get_stock_price("AAPL")
        assert result["ticker"] == "AAPL"
        assert result["price"] == 175.50

    def test_invalid_ticker_raises_error(self):
        mock_resp = make_mock_response({
            "status": "error",
            "code": 400,
            "message": "symbol not found"
        })
        with patch('tools.requests.get', return_value=mock_resp):
            with pytest.raises(InvalidTickerError):
                get_stock_price("INVALID123")

    def test_rate_limit_raises_error(self):
        mock_resp = make_mock_response({}, status_code=429)
        with patch('tools.requests.get', return_value=mock_resp):
            with pytest.raises(RateLimitError):
                get_stock_price("AAPL")

class TestGetPriceHistory:
    def test_returns_10_prices(self):
        mock_data = {
            "values": [
                {"datetime": f"2024-01-{10-i:02d}", "close": str(170.0 + i)}
                for i in range(10)
            ]
        }
        mock_resp = make_mock_response(mock_data)
        with patch('tools.requests.get', return_value=mock_resp):
            result = get_price_history("AAPL")
        assert len(result["prices"]) == 10
        assert len(result["dates"]) == 10

class TestCalculateRSI:
    def test_overbought_status(self):
        mock_resp = make_mock_response({"values": [{"rsi": "75.5"}]})
        with patch('tools.requests.get', return_value=mock_resp):
            result = calculate_rsi("AAPL")
        assert result["rsi"] == 75.5
        assert result["status"] == "Overbought"

    def test_oversold_status(self):
        mock_resp = make_mock_response({"values": [{"rsi": "25.0"}]})
        with patch('tools.requests.get', return_value=mock_resp):
            result = calculate_rsi("AAPL")
        assert result["status"] == "Oversold"

    def test_neutral_status(self):
        mock_resp = make_mock_response({"values": [{"rsi": "55.0"}]})
        with patch('tools.requests.get', return_value=mock_resp):
            result = calculate_rsi("AAPL")
        assert result["status"] == "Neutral"

class TestGetSMA:
    def test_golden_cross(self):
        responses = [
            make_mock_response({"values": [{"sma": "175.0"}]}),  # SMA 50
            make_mock_response({"values": [{"sma": "165.0"}]}),  # SMA 200
        ]
        with patch('tools.requests.get', side_effect=responses):
            result = get_sma("AAPL")
        assert result["sma_50"] > result["sma_200"]
        assert "Golden Cross" in result["trend"]

    def test_death_cross(self):
        responses = [
            make_mock_response({"values": [{"sma": "155.0"}]}),  # SMA 50
            make_mock_response({"values": [{"sma": "165.0"}]}),  # SMA 200
        ]
        with patch('tools.requests.get', side_effect=responses):
            result = get_sma("AAPL")
        assert "Death Cross" in result["trend"]
