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

test_register()

def test_login():
    endpoint = "login"

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

test_login()

def test_login_fail():
    endpoint = "login"

    inputData = {
        "email": "abc",
        "password": "123"
    }
    inputData = json.dumps(inputData)

    response = requests.post(
        base_auth + endpoint,
        headers=headers,
        data=inputData
    )
    assert response.status_code == 401

test_login_fail()