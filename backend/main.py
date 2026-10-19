
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

from models import (
    AnalyzeRequest, AnalyzeResponse,
    CompareRequest, CompareResponse,
    ChatRequest, ChatResponse,
    HealthResponse,
)
from services.analysis import run_analysis
from services.comparison import run_comparison
from services.chat import run_chat
from utils.errors import APIError

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    missing = []
    if not os.getenv("GEMINI_API_KEY"):
        missing.append("GEMINI_API_KEY")
    if not os.getenv("TWELVEDATA_API_KEY"):
        missing.append("TWELVEDATA_API_KEY")

    if missing:
        print(f"WARNING: Missing environment variables: {', '.join(missing)}")
        print("Configure these variables in the backend deployment settings.")
    else:
        print("[OK] All API keys configured")

    yield


app = FastAPI(
    title="AI Stock Trading Analyst API",
    description="AI-powered stock analysis using Twelve Data and Google Gemini",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration
allowed_origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "https://stock-trading-analyst.vercel.app",
]

production_origin = os.getenv("FRONTEND_URL", "").strip().rstrip("/")
if production_origin and production_origin not in allowed_origins:
    allowed_origins.append(production_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)


@app.exception_handler(APIError)
async def api_error_handler(request: Request, exc: APIError) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message},
    )


@app.get("/api/health", response_model=HealthResponse, tags=["Health"])
async def health():
    return HealthResponse(
        status="ok",
        message="AI Stock Trading Analyst API is running",
    )


@app.post("/api/analyze", response_model=AnalyzeResponse, tags=["Analysis"])
async def analyze(request: AnalyzeRequest):
    try:
        return await run_analysis(request.ticker, request.question)
    except APIError:
        raise
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Analysis failed. Please try again.",
        )


@app.post("/api/compare", response_model=CompareResponse, tags=["Comparison"])
async def compare(request: CompareRequest):
    try:
        return await run_comparison(request.ticker1, request.ticker2)
    except APIError:
        raise
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Comparison failed. Please try again.",
        )


@app.post("/api/chat", response_model=ChatResponse, tags=["Chat"])
async def chat(request: ChatRequest):
    try:
        history_dicts = [
            {"role": message.role, "content": message.content}
            for message in (request.history or [])
        ]
        return await run_chat(request.message, history_dicts)
    except APIError:
        raise
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Chat failed. Please try again.",
        )
