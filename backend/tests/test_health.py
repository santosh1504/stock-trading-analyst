def test_health_endpoint(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "message" in data

def test_health_returns_correct_structure(client):
    response = client.get("/api/health")
    data = response.json()
    assert set(data.keys()) >= {"status", "message"}
