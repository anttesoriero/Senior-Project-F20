import requests
import json

base_auth = "http://127.0.0.1:5000/auth/"
headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}


def test_register():
    endpoint = "register"

    inputData = {
        "email": "abc",
        "password": "xyz"
    }
    inputData = json.dumps(inputData)

    response = requests.post(
        base_auth + endpoint,
        headers=headers,
        data=inputData
    )
    assert response.status_code == 200