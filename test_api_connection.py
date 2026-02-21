import requests
import json

def test_chat():
    url = "http://localhost:8000/api/chat"
    # Try with v1 prefix if /api/chat fails
    url_v1 = "http://localhost:8000/api/chat" 
    
    payload = {
        "message": "hello",
        "user_id": "test_user"
    }
    headers = {
        "Content-Type": "application/json"
    }
    
    for test_url in [url, url_v1]:
        try:
            print(f"\nSending request to {test_url}...")
            response = requests.post(test_url, json=payload, headers=headers)
            print(f"Status Code: {response.status_code}")
            if response.status_code == 200:
                print(f"Response: {json.dumps(response.json(), indent=2)}")
                break
            else:
                print(f"Response: {response.text}")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    test_chat()
