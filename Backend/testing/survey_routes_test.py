import requests
import json

base_survey="http://127.0.0.1:5000/survey/"
headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
}

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
    
    assert response.status_code == 200, "test_getSurvey()" # Returns 401 error

test_getSurvey()