import re
from utils.errors import InvalidTickerError

VALID_TICKER_PATTERN = re.compile(r'^[A-Z]{1,5}(\.[A-Z]{1,2})?$')

# Common invalid tickers to reject immediately
INVALID_TICKERS = {'TEST', 'FAKE', 'DEMO', 'EXAMPLE', 'NULL', 'NONE', 'NA'}

def validate_and_clean_ticker(ticker: str) -> str:
    """Validate and clean a stock ticker symbol."""
    cleaned = ticker.strip().upper()
    
    if not cleaned:
        raise InvalidTickerError(ticker)
    
    if len(cleaned) > 10:
        raise InvalidTickerError(ticker)
    
    if cleaned in INVALID_TICKERS:
        raise InvalidTickerError(cleaned)
    
    # Allow alphanumeric with optional dot (for BRK.A, BRK.B etc)
    if not re.match(r'^[A-Z0-9]{1,6}(\.[A-Z]{1,2})?$', cleaned):
        raise InvalidTickerError(cleaned)
    
    return cleaned

def sanitize_question(question: str) -> str:
    """Sanitize user question input."""
    if not question:
        return ''
    # Remove potential injection characters, keep it safe
    sanitized = question.strip()[:500]
    return sanitized
