import requests
import json

base_auth = "http://127.0.0.1:5000/auth/"
base_user="http://127.0.0.1:5000/user/"
headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
}

# Registers two users for testing
def test_register():
    for n in range(2):
        endpoint = "register"

        email="user_routes_test_user(" + str(n) + ")"

        inputData = {
            "email": email,
            "password": "password"
        }
        inputData = json.dumps(inputData)

        response = requests.post(
            base_auth + endpoint,
            headers=headers,
            data=inputData
        )
        assert response.status_code == 200, "test_register()"

test_register()

# Logs user in for testing
def test_login():
    endpoint = "login"

    inputData = {
        "email": "user_routes_test_user(0)",
        "password": "password"
    }
    inputData = json.dumps(inputData)

    response = requests.post(
        base_auth + endpoint,
        headers=headers,
        data=inputData
    )
    
    assert response.status_code == 200, "test_login()"

    return response.json()["access_token"]

test_login()
headers["Authorization"] = 'Bearer ' + test_login()

# Tests getBriefProfile for success
def test_getBriefProfile():
    endpoint = "getBriefProfile"

    inputData = {
        "otherUser": 2
    }

    response = requests.get(
        base_user + endpoint,
        headers=headers,
        params=inputData
    )
    
    assert response.status_code == 200, "test_getBriefProfile()"

test_getBriefProfile()

# Tests getProfile for success
def test_getProfile():
    endpoint = "getProfile"

    inputData = {
        "otherUser": 2
    }

    response = requests.get(
        base_user + endpoint,
        headers=headers,
        params=inputData
    )
    
    assert response.status_code == 200, "test_getProfile()"

test_getProfile()