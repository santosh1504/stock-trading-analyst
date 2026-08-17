from unittest.mock import patch, AsyncMock
from models import ChatResponse

def test_chat_basic_message(client):
    mock_resp = ChatResponse(reply="Apple (AAPL) is currently showing neutral RSI.", sources_used=["Google Gemini 2.5 Flash"])
    with patch('main.run_chat', new=AsyncMock(return_value=mock_resp)):
        response = client.post("/api/chat", json={"message": "What is Apple's RSI?"})
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert len(data["reply"]) > 0

def test_chat_empty_message(client):
    response = client.post("/api/chat", json={"message": ""})
    assert response.status_code == 422

def test_chat_with_history(client):
    mock_resp = ChatResponse(reply="Based on the RSI, AAPL looks neutral.", sources_used=["Google Gemini 2.5 Flash"])
    with patch('main.run_chat', new=AsyncMock(return_value=mock_resp)):
        response = client.post("/api/chat", json={
            "message": "What about the SMA?",
            "history": [
                {"role": "user", "content": "Tell me about AAPL"},
                {"role": "assistant", "content": "AAPL is Apple Inc."}
            ]
        })
    assert response.status_code == 200

def test_chat_returns_sources(client):
    mock_resp = ChatResponse(reply="AAPL RSI is 55.", sources_used=["Twelve Data: AAPL live market data", "Google Gemini 2.5 Flash"])
    with patch('main.run_chat', new=AsyncMock(return_value=mock_resp)):
        response = client.post("/api/chat", json={"message": "What is AAPL RSI?"})
    data = response.json()
    assert isinstance(data["sources_used"], list)
