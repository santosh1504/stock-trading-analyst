class APIError(Exception):
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(message)

class InvalidTickerError(APIError):
    def __init__(self, ticker: str):
        super().__init__(f"Invalid or unknown ticker symbol: '{ticker}'. Please use a valid stock symbol like AAPL, MSFT, GOOGL.", 422)

class MarketDataError(APIError):
    def __init__(self, detail: str = "Failed to fetch market data"):
        super().__init__(f"Market data unavailable: {detail}. Please try again later.", 503)

class AIAnalysisError(APIError):
    def __init__(self, detail: str = "AI analysis failed"):
        super().__init__(f"AI analysis error: {detail}. Please try again.", 500)

class RateLimitError(APIError):
    def __init__(self):
        super().__init__("API rate limit exceeded. Please wait a moment and try again.", 429)
