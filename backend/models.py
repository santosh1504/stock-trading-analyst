from pydantic import BaseModel, Field, field_validator
from typing import Optional, List

class HealthResponse(BaseModel):
    status: str
    message: str

class AnalyzeRequest(BaseModel):
    ticker: str = Field(..., min_length=1, max_length=10, description="Stock ticker symbol")
    question: Optional[str] = Field(None, max_length=500, description="Optional analysis question")

    @field_validator('ticker')
    @classmethod
    def validate_ticker(cls, v: str) -> str:
        cleaned = v.strip().upper()
        if not cleaned.isalpha() and not all(c.isalnum() or c in '.-' for c in cleaned):
            raise ValueError('Invalid ticker format')
        return cleaned

class AnalyzeResponse(BaseModel):
    ticker: str
    current_price: float
    historical_prices: List[float]
    historical_dates: List[str]
    rsi: float
    rsi_status: str  # Overbought, Oversold, Neutral
    sma_50: float
    sma_200: float
    trend: str  # Golden Cross / Bullish, Death Cross / Bearish
    decision: str  # BUY, SELL, HOLD
    confidence: str  # High, Medium, Low
    rationale: str

class CompareRequest(BaseModel):
    ticker1: str = Field(..., min_length=1, max_length=10)
    ticker2: str = Field(..., min_length=1, max_length=10)
    question: Optional[str] = Field(None, max_length=500)

    @field_validator('ticker1', 'ticker2')
    @classmethod
    def validate_ticker(cls, v: str) -> str:
        cleaned = v.strip().upper()
        if not all(c.isalnum() or c in '.-' for c in cleaned):
            raise ValueError('Invalid ticker format')
        return cleaned

class CompareResponse(BaseModel):
    stock1: AnalyzeResponse
    stock2: AnalyzeResponse
    stronger_stock: str
    comparison_rationale: str

class ChatMessage(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)
    history: Optional[List[ChatMessage]] = Field(default_factory=list)

class ChatResponse(BaseModel):
    reply: str
    sources_used: List[str] = Field(default_factory=list)
