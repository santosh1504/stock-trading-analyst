import os
import requests
from typing import Dict, Any, List
from dotenv import load_dotenv
from utils.errors import MarketDataError, InvalidTickerError, RateLimitError

load_dotenv()

TWELVEDATA_BASE_URL = "https://api.twelvedata.com"
TIMEOUT = 15  # seconds

def _get_api_key() -> str:
    key = os.getenv("TWELVEDATA_API_KEY", "")
    if not key:
        raise MarketDataError("TWELVEDATA_API_KEY is not configured")
    return key

def _handle_response(response: requests.Response, ticker: str) -> Dict[str, Any]:
    """Handle Twelve Data API response and raise appropriate errors."""
    if response.status_code == 429:
        raise RateLimitError()
    
    if response.status_code != 200:
        raise MarketDataError(f"HTTP {response.status_code} from market data API")
    
    data = response.json()
    
    # Twelve Data returns status field for errors
    if isinstance(data, dict):
        status = data.get('status', 'ok')
        code = data.get('code', 200)
        
        if status == 'error' or code in [400, 401, 403, 404, 429]:
            message = data.get('message', 'Unknown error')
            if 'not found' in message.lower() or 'symbol' in message.lower():
                raise InvalidTickerError(ticker)
            if code == 429:
                raise RateLimitError()
            raise MarketDataError(message)
    
    return data


def get_stock_price(ticker: str) -> Dict[str, Any]:
    """
    Fetch the current price for a stock ticker.
    Returns dict with 'ticker' and 'price' keys.
    """
    api_key = _get_api_key()
    
    url = f"{TWELVEDATA_BASE_URL}/price"
    params = {
        "symbol": ticker,
        "apikey": api_key
    }
    
    try:
        response = requests.get(url, params=params, timeout=TIMEOUT)
        data = _handle_response(response, ticker)
        
        price_str = data.get('price')
        if not price_str:
            raise MarketDataError(f"No price data returned for {ticker}")
        
        return {
            "ticker": ticker,
            "price": float(price_str)
        }
    except (MarketDataError, InvalidTickerError, RateLimitError):
        raise
    except requests.exceptions.Timeout:
        raise MarketDataError("Request timed out. Please try again.")
    except requests.exceptions.ConnectionError:
        raise MarketDataError("Unable to connect to market data service.")
    except (ValueError, KeyError) as e:
        raise MarketDataError(f"Failed to parse price data: {e}")


def get_price_history(ticker: str) -> Dict[str, Any]:
    """
    Fetch the last 10 daily closing prices for a ticker.
    Returns dict with 'ticker', 'dates', and 'prices' keys.
    """
    api_key = _get_api_key()
    
    url = f"{TWELVEDATA_BASE_URL}/time_series"
    params = {
        "symbol": ticker,
        "interval": "1day",
        "outputsize": 10,
        "apikey": api_key
    }
    
    try:
        response = requests.get(url, params=params, timeout=TIMEOUT)
        data = _handle_response(response, ticker)
        
        values = data.get('values', [])
        if not values:
            raise MarketDataError(f"No historical data returned for {ticker}")
        
        # Twelve Data returns newest first — reverse for chronological order
        values_reversed = list(reversed(values))
        
        dates = [v['datetime'] for v in values_reversed]
        prices = [float(v['close']) for v in values_reversed]
        
        return {
            "ticker": ticker,
            "dates": dates,
            "prices": prices
        }
    except (MarketDataError, InvalidTickerError, RateLimitError):
        raise
    except requests.exceptions.Timeout:
        raise MarketDataError("Request timed out fetching price history.")
    except requests.exceptions.ConnectionError:
        raise MarketDataError("Unable to connect to market data service.")
    except (ValueError, KeyError) as e:
        raise MarketDataError(f"Failed to parse historical data: {e}")


def calculate_rsi(ticker: str) -> Dict[str, Any]:
    """
    Fetch 14-day RSI for a ticker.
    Returns dict with 'ticker', 'rsi', and 'status' keys.
    Status: 'Overbought' (>70), 'Oversold' (<30), 'Neutral'
    """
    api_key = _get_api_key()
    
    url = f"{TWELVEDATA_BASE_URL}/rsi"
    params = {
        "symbol": ticker,
        "interval": "1day",
        "time_period": 14,
        "series_type": "close",
        "outputsize": 1,
        "apikey": api_key
    }
    
    try:
        response = requests.get(url, params=params, timeout=TIMEOUT)
        data = _handle_response(response, ticker)
        
        values = data.get('values', [])
        if not values:
            raise MarketDataError(f"No RSI data returned for {ticker}")
        
        rsi_value = float(values[0]['rsi'])
        
        if rsi_value > 70:
            status = "Overbought"
        elif rsi_value < 30:
            status = "Oversold"
        else:
            status = "Neutral"
        
        return {
            "ticker": ticker,
            "rsi": round(rsi_value, 2),
            "status": status
        }
    except (MarketDataError, InvalidTickerError, RateLimitError):
        raise
    except requests.exceptions.Timeout:
        raise MarketDataError("Request timed out calculating RSI.")
    except requests.exceptions.ConnectionError:
        raise MarketDataError("Unable to connect to market data service.")
    except (ValueError, KeyError) as e:
        raise MarketDataError(f"Failed to parse RSI data: {e}")


def get_sma(ticker: str) -> Dict[str, Any]:
    """
    Fetch 50-day and 200-day SMA for a ticker.
    Returns dict with 'ticker', 'sma_50', 'sma_200', and 'trend' keys.
    Trend: 'Golden Cross / Bullish' or 'Death Cross / Bearish'
    """
    api_key = _get_api_key()
    
    def fetch_sma(period: int) -> float:
        url = f"{TWELVEDATA_BASE_URL}/sma"
        params = {
            "symbol": ticker,
            "interval": "1day",
            "time_period": period,
            "series_type": "close",
            "outputsize": 1,
            "apikey": api_key
        }
        response = requests.get(url, params=params, timeout=TIMEOUT)
        data = _handle_response(response, ticker)
        values = data.get('values', [])
        if not values:
            raise MarketDataError(f"No SMA-{period} data returned for {ticker}")
        return round(float(values[0]['sma']), 4)
    
    try:
        sma_50 = fetch_sma(50)
        sma_200 = fetch_sma(200)
        
        if sma_50 > sma_200:
            trend = "Golden Cross / Bullish"
        else:
            trend = "Death Cross / Bearish"
        
        return {
            "ticker": ticker,
            "sma_50": sma_50,
            "sma_200": sma_200,
            "trend": trend
        }
    except (MarketDataError, InvalidTickerError, RateLimitError):
        raise
    except requests.exceptions.Timeout:
        raise MarketDataError("Request timed out fetching SMA data.")
    except requests.exceptions.ConnectionError:
        raise MarketDataError("Unable to connect to market data service.")
    except (ValueError, KeyError) as e:
        raise MarketDataError(f"Failed to parse SMA data: {e}")
