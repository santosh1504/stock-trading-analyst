import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import sys
import os

# Ensure backend directory is in path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

# Set dummy env vars for tests
os.environ.setdefault('GEMINI_API_KEY', 'test-gemini-key')
os.environ.setdefault('TWELVEDATA_API_KEY', 'test-twelvedata-key')

from main import app

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def mock_price_data():
    return {"ticker": "AAPL", "price": 175.50}

@pytest.fixture
def mock_history_data():
    return {
        "ticker": "AAPL",
        "dates": ["2024-01-01", "2024-01-02", "2024-01-03", "2024-01-04", "2024-01-05",
                  "2024-01-08", "2024-01-09", "2024-01-10", "2024-01-11", "2024-01-12"],
        "prices": [170.0, 171.5, 172.0, 173.5, 174.0, 175.0, 174.5, 176.0, 175.5, 175.5]
    }

@pytest.fixture
def mock_rsi_data():
    return {"ticker": "AAPL", "rsi": 55.5, "status": "Neutral"}

@pytest.fixture
def mock_sma_data():
    return {"ticker": "AAPL", "sma_50": 170.0, "sma_200": 165.0, "trend": "Golden Cross / Bullish"}

@pytest.fixture
def mock_ai_result():
    return {
        "decision": "HOLD",
        "confidence": "Medium",
        "rationale": "AAPL shows neutral RSI and bullish SMA crossover. Educational analysis only."
    }

@pytest.fixture
def mock_full_analysis(mock_price_data, mock_history_data, mock_rsi_data, mock_sma_data, mock_ai_result):
    from models import AnalyzeResponse
    return AnalyzeResponse(
        ticker="AAPL",
        current_price=175.50,
        historical_prices=[170.0, 171.5, 172.0, 173.5, 174.0, 175.0, 174.5, 176.0, 175.5, 175.5],
        historical_dates=["2024-01-01", "2024-01-02", "2024-01-03", "2024-01-04", "2024-01-05",
                          "2024-01-08", "2024-01-09", "2024-01-10", "2024-01-11", "2024-01-12"],
        rsi=55.5,
        rsi_status="Neutral",
        sma_50=170.0,
        sma_200=165.0,
        trend="Golden Cross / Bullish",
        decision="HOLD",
        confidence="Medium",
        rationale="AAPL shows neutral RSI and bullish SMA crossover. Educational analysis only."
    )
