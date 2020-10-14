import requests
import json

base_auth = "http://127.0.0.1:5000/auth/"
headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
}

# Tests register endpoint for success
def test_register():
    endpoint = "register"

    inputData = {
        "email": "auth_routes_test_user",
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

# Tests login endpoint for success
def test_login():
    endpoint = "login"

    inputData = {
        "email": "auth_routes_test_user",
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

# Stores Bearer token in header 
headers["Authorization"] = 'Bearer ' + test_login()

# Tests login endpoint for fail
def test_login_fail():
    endpoint = "login"

    inputData = {
        "email": "auth_routes_test_user",
        "password": "password123"
    }
    inputData = json.dumps(inputData)

    response = requests.post(
        base_auth + endpoint,
        headers=headers,
        data=inputData
    )
    assert response.status_code == 401, "test_login_fail()"

test_login_fail()

# Tests changePasswordWithAuth for success
def test_changePasswordWithAuth():
    endpoint = "changePasswordWithAuth"

    inputData = {
        "oldPassword": "password",
        "newPassword": "password123"
    }
    inputData = json.dumps(inputData)

    response = requests.post(
        base_auth + endpoint,
        headers=headers,
        data=inputData
    )

    assert response.status_code == 200, "test_changePasswordWithAuth()"

test_changePasswordWithAuth()

# Tests changePasswordWithAuth for fail
def test_changePasswordWithAuth_fail():
    endpoint = "changePasswordWithAuth"

    inputData = {
        "oldPassword": "123password",
        "newPassword": "password"
    }
    inputData = json.dumps(inputData)

    response = requests.post(
        base_auth + endpoint,
        headers=headers,
        data=inputData
    )

    assert response.status_code == 401, "test_changePasswordWithAuth_fail()"

test_changePasswordWithAuth_fail()









# Removes auth_routes_test_user from Credentials table and Users table
