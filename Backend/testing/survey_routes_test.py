import requests
import json

base_auth = "http://127.0.0.1:5000/auth/"
base_survey="http://127.0.0.1:5000/survey/"
headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
}

# Registers user for testing
def test_register():
    endpoint = "register"

    inputData = {
        "email": "survey_routes_test_user",
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
        "email": "survey_routes_test_user",
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

# Tests recommendSurvey
def test_recommendSurvey():
    endpoint = "recommendSurvey"

    response = requests.get(
        base_survey + endpoint,
        headers=headers
    )
    
    assert response.status_code == 200, "test_recommendSurvey()"

test_recommendSurvey()

# Tests getSurvey for success
def test_getSurvey():
    endpoint = "getSurvey"

    inputData = {
        "surveyId": 1
    }

    response = requests.get(
        base_survey + endpoint,
        headers=headers,
        params=inputData
    )
    
    assert response.status_code == 200, "test_getSurvey()"

test_getSurvey()

# Tests respond for success
def test_respond():
    endpoint = "respond"

    inputData = {
        "surveyId": 1,
        "response": 2
    }
    inputData = json.dumps(inputData)

    response = requests.post(
        base_survey + endpoint,
        headers=headers,
        data=inputData
    )
    
    assert response.status_code == 200, "test_respond()"

test_respond()
