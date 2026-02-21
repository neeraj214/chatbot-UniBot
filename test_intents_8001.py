import requests


def send(message: str) -> None:
    url = "http://127.0.0.1:8001/api/chat"
    payload = {"message": message, "user_id": "debug_user"}
    headers = {"Content-Type": "application/json"}

    print(f"=== {message} ===")
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        print("Status:", response.status_code)
        print("Body:", response.text)
    except Exception as exc:
        print("Error:", exc)


if __name__ == "__main__":
    for msg in ["hello", "Who are you?", "what is current time", "Tell me a joke"]:
        send(msg)
        print()

