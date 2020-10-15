import requests
import json

base_auth = "http://127.0.0.1:5000/auth/"
base_task="http://127.0.0.1:5000/task/"
headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
}

# Registers user for testing
def test_register():
    endpoint = "register"

    inputData = {
        "email": "task_routes_test_user",
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
        "email": "task_routes_test_user",
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

# Tests recommendTask for success
def test_recommendTasks():
    endpoint = "recommendTasks"

    response = requests.get(
        base_task + endpoint,
        headers=headers
    )
    
    assert response.status_code == 200, "test_recommendTasks()"

test_recommendTasks()

# Tests createTask for success with required params
def test_createTask_required():
    endpoint = "createTask"

    inputData = {
        "categoryId": 1,
        "title": "Test_Required_Params"
    }
    inputData = json.dumps(inputData)

    response = requests.post(
        base_task + endpoint,
        headers=headers,
        data=inputData
    )

    assert response.status_code == 200, "test_createTask_required()"

test_createTask_required()

# Tests createTask for success with required params and optional params
def test_createTask_optional():
    endpoint = "createTask"

    inputData = {
        "categoryId": 4,
        "title": "Test_Optional_Params",
        "description": "This task tests the optional params",
        "recommendedPrice": 50.0,
        "estimatedDurationMinutes": 30

    }
    inputData = json.dumps(inputData)

    response = requests.post(
        base_task + endpoint,
        headers=headers,
        data=inputData
    )

    assert response.status_code == 200, "test_createTask_optional()"

test_createTask_optional()

# Tests updateTask for success with required params and optional params


# Tests getBriefPublic for success
def test_getBriefPublic():
    endpoint = "getBriefPublic"

    response = requests.get(
        base_task + endpoint,
        headers=headers
    )
    
    assert response.status_code == 200, "test_getBriefPublic()"

test_getBriefPublic()

# Tests getPublic for success
def test_getPublic():
    endpoint = "getPublic"

    response = requests.get(
        base_task + endpoint,
        headers=headers
    )
    
    assert response.status_code == 200, "test_getPublic()"

test_getPublic()

# Tests deleteTask for success

