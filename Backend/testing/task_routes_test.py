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

    return response.json()["taskId"]

test_createTask_required()

taskId=test_createTask_required()

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


# Tests updateTask for success
def test_updateTask():
    endpoint = "editTask"

    inputData = {
        "taskId": taskId,
        "categoryId": 4,
        "title": "Test_Update_Task",
        "description": "This task tests updating a task",
        "recommendedPrice": 100.0,
        "estimatedDurationMinutes": 90

    }
    inputData = json.dumps(inputData)

    response = requests.patch(
        base_task + endpoint,
        headers=headers,
        data=inputData
    )

    assert response.status_code == 200, "test_updateTask()"

test_updateTask()

# Tests getBriefPublic for success
def test_getBriefPublic():
    endpoint = "getBriefPublic"

    inputData = {
        "taskId": int(taskId),
    }

    response = requests.get(
        base_task + endpoint,
        headers=headers,
        params=inputData
    )
    
    assert response.status_code == 200, "test_getBriefPublic()"

test_getBriefPublic()

# Tests getPublic for success
def test_getPublic():
    endpoint = "getPublic"

    inputData = {
        "taskId": int(taskId),
    }

    response = requests.get(
        base_task + endpoint,
        headers=headers,
        params=inputData
    )
    
    assert response.status_code == 200, "test_getPublic()"

test_getPublic()

# Tests getBriefPrivate for success
def test_getBriefPrivate():
    endpoint = "getBriefPrivate"

    inputData = {
        "taskId": int(taskId),
    }

    response = requests.get(
        base_task + endpoint,
        headers=headers,
        params=inputData
    )
    
    assert response.status_code == 200, "test_getBriefPrivate()"

test_getBriefPrivate()

# Tests getPrivate for success
def test_getPrivate():
    endpoint = "getPrivate"

    inputData = {
        "taskId": int(taskId),
    }

    response = requests.get(
        base_task + endpoint,
        headers=headers,
        params=inputData
    )
    
    assert response.status_code == 200, "test_getPrivate()"

test_getPrivate()


# Tests deleteTask for success
def test_deleteTask():
    endpoint = "deleteTask"

    inputData = {
        "taskId": int(taskId),
    }

    response = requests.delete(
        base_task + endpoint,
        headers=headers,
        params=inputData
    )
    
    assert response.status_code == 200, "test_deleteTask()"

test_deleteTask()
