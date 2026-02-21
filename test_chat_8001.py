
import requests
import json

def test_chat():
    url = "http://localhost:8001/api/chat"
    payload = {"message": "hello", "user_id": "test_user"}
    headers = {"Content-Type": "application/json"}
    
    try:
        print(f"Sending request to {url}...")
        response = requests.post(url, json=payload, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response Body: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_chat()
