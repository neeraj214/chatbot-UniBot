
import requests
import json

def test_admin():
    url = "http://localhost:8001/api/intent"
    headers = {
        "Content-Type": "application/json",
        "X-Admin-Key": "super-secret-admin-key"
    }
    
    # 1. Test GET intents
    print("Testing GET /api/intents...")
    response = requests.get("http://localhost:8001/api/intents", headers=headers)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print(f"Intents count: {len(response.json())}")
    
    # 2. Test POST intent
    print("\nTesting POST /api/intent...")
    import random
    tag = f"test_tag_{random.randint(1, 1000)}"
    new_intent = {
        "tag": tag,
        "patterns": ["test pattern 1", "test pattern 2"],
        "responses": ["test response 1"]
    }
    response = requests.post(url, headers=headers, json=new_intent)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    
    # 3. Test Retrain
    print("\nTesting POST /api/retrain...")
    retrain_url = "http://localhost:8001/api/retrain"
    response = requests.post(retrain_url, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")

if __name__ == "__main__":
    test_admin()
