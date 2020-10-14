import requests
import json

base_auth = "http://127.0.0.1:5000/auth/"
base_me="http://127.0.0.1:5000/me/"
headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
}

# Registers user for testing
def test_register():
    endpoint = "register"

    inputData = {
        "email": "me_routes_test_user",
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
        "email": "me_routes_test_user",
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


# Tests getProfile for success
def test_getProfile():
    endpoint = "getProfile"

    response = requests.get(
        base_me + endpoint,
        headers=headers
    )
    
    assert response.status_code == 200, "test_getProfile()"

test_getProfile()

# Tests getProfile for success
def test_getPostedTasks():
    endpoint = "getPostedTasks"

    response = requests.get(
        base_me + endpoint,
        headers=headers
    )
    
    assert response.status_code == 200, "test_getPostedTasks()"

test_getPostedTasks()