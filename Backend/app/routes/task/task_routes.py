"""
Defines routes for the main (Miscellaneous) endpoints

! Try to use utilities outside of this file to do the heavy lifting !
This file should be focused on annotating routes

@author Matthew Schofield
@version 10.14.2020
"""
# Library imports
from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

# Module imports
from app.routes.task import task_blueprint
from app.utilities.validation.validation import validateRequestJSON
from app.utilities.global_account import completeDeal
from app.routes.task.task_recommender import task_recommender

# Model imports
from app.models.user_model import User
from app.models.task_model import Task

'''
GETs
'''
@task_blueprint.route('/getBriefPublic', methods=['GET'])
@jwt_required
def getBriefPublic():
    '''
    Get brief public information about a task

    ?
    taskId=<taskId>

    Out:
    {
        "accepted": bool
        "categoryId": int
        "recommendedPrice": float nullable
        "taskId": int
        "title": str
    }
    '''
    # Validate inputs
    taskId = request.args.get('taskId', type=int)

    # Get task
    task = Task.getByTaskId(taskId)
    if task is None:
        return jsonify({"success":False}), 404

    # Get information
    responseInformation = task.getBriefPublicInfo()

    return jsonify(responseInformation), 200

@task_blueprint.route('/getPublic', methods=['GET'])
@jwt_required
def getPublic():
    '''
    Get all public information about a task

    ?
    taskId=<taskId>

    Out:
    {
        "accepted": bool
        "categoryId": int
        "description": str nullable
        "posterTaskId": int
        "recommendedPrice": float nullable
        "taskId": int
        "title": str
        "estimatedDurationMinutes": int nullable
        "locationALongitude": float nullable
        "locationALatitude": float nullable
        "locationBLongitude": float nullable
        "locationBLatitude": float nullable
    }
    '''
    # Validate inputs
    taskId = request.args.get('taskId', type=int)

    # Get task
    task = Task.getByTaskId(taskId)
    if task is None:
        return jsonify({"success":False}), 404

    # Get information
    responseInformation = task.getPublicInfo()

    return jsonify(responseInformation), 200

@task_blueprint.route('/getBriefPrivate', methods=['GET'])
@jwt_required
def getBriefPrivate():
    '''
    Get brief public information about a task

    ?
    taskId=<taskId>

    Out:
    {
        "accepted": bool
        "categoryId": int
        "recommendedPrice": float nullable
        "taskId": int
        "title": str
    }
    '''
    # Validate inputs
    taskId = request.args.get('taskId', type=int)

    # Get task
    task = Task.getByTaskId(taskId)
    if task is None:
        return jsonify({"success":False}), 404

    # Get information
    responseInformation = task.getBriefPublicInfo()

    return jsonify(responseInformation), 200

@task_blueprint.route('/getPrivate', methods=['GET'])
@jwt_required
def getPrivate():
    '''
    Get all public information about a task

    ?
    taskId=<taskId>

    Out:
    {
        "accepted": bool
        "categoryId": int
        "description": str nullable
        "posterTaskId": int
        "recommendedPrice": float nullable
        "taskId": int
        "title": str
        "estimatedDurationMinutes": int nullable
        "locationALongitude": float nullable
        "locationALatitude": float nullable
        "locationBLongitude": float nullable
        "locationBLatitude": float nullable
    }
    '''
    # Validate inputs
    taskId = request.args.get('taskId', type=int)

    # Get task
    task = Task.getByTaskId(taskId)
    if task is None:
        return jsonify({"success":False}), 404

    # Get information
    responseInformation = task.getPrivateInfo()

    return jsonify(responseInformation), 200

@task_blueprint.route('/recommendTasks', methods=['GET'])
@jwt_required
def recommendTasks():
    '''
    Return an ordered list of task ids for the user

    :return: task recommendations

    '''
    # Get current user
    current_user_id = get_jwt_identity()
    user = User.getByUserId(current_user_id)

    result = task_recommender.recommend(user)

    return jsonify(result), 200

'''
POSTs
'''
@task_blueprint.route('/createTask', methods=['POST'])
@jwt_required
def createTask():
    '''
    Create a task

    In
    * optional
    {
        "categoryId": int
        "title": str
        *"description": str
        *"recommendedPrice": float,
        *"estimatedDurationMinutes": int,
        *"locationALongitude": float,
        *"locationALatitude": float,
        *"locationBLongitude": float,
        *"locationBLatitude": float
    }
    Out
    {
        "taskId": int
    }
    '''
    # Validate input
    requiredParameters = ["categoryId", "title"]

    optionalParameters = ["description", "recommendedPrice", "estimatedDurationMinutes",
                          "locationALongitude", "locationALatitude", "locationBLongitude",
                          "locationBLatitude", "startDate"]

    success, code, inputJSON = validateRequestJSON(request, requiredParameters, optionalParameters)
    if not success:
        return jsonify({}), code

    # Get current user
    current_user_id = get_jwt_identity()
    user = User.getByUserId(current_user_id)

    # Create task
    task = Task.createTask(
        user=user,
        categoryId=inputJSON["categoryId"],
        title=inputJSON["title"],
        startDate=inputJSON["startDate"],
        description=inputJSON["description"],
        recommendedPrice=inputJSON["recommendedPrice"],
        estimatedDurationMinutes=inputJSON["estimatedDurationMinutes"],
        locationALongitude=inputJSON["locationALongitude"],
        locationALatitude=inputJSON["locationALatitude"],
        locationBLongitude=inputJSON["locationBLongitude"],
        locationBLatitude=inputJSON["locationBLatitude"]
    )

    # Build output
    output = {
        "taskId": task.taskId
    }

    return jsonify(output), 200

@task_blueprint.route('/searchPostedTasks', methods=['POST'])
@jwt_required
def searchTask():
    # Validate input
    requiredParameters = ["query"]
    optionalParameters = ["max"]

    success, code, inputJSON = validateRequestJSON(request, requiredParameters, optionalParameters)
    if not success:
        return jsonify({}), code

    # Output
    foundTasks = Task.search(inputJSON["query"], inputJSON.get("max", 100))

    # Build output
    output = {
        "tasks": [task.getPublicInfo() for task in foundTasks]
    }

    return jsonify(output), 200

'''
DELETEs
'''
@task_blueprint.route('/deleteTask', methods=['DELETE'])
@jwt_required
def deleteTask():
    '''
    Delete a task by a given Id if the current user is the poster

    TODO:
    Check there are no offers
    '''
    taskId = request.args.get('taskId', type=int)
    # Get current user
    current_user_id = get_jwt_identity()

    # Get target task
    task = Task.getByTaskId(taskId)
    if task:
        # Check if the user is the poster
        if task.posterUserId == current_user_id:
            # Delete task
            Task.deleteByTaskId(task.taskId)
            return jsonify({"success": True}), 200
        else:
            # User does not have permission to delete the task
            return jsonify({"success": False}), 403
    else:
        # Task not found
        return jsonify({"success": False}), 404

'''
PUTs
'''
@task_blueprint.route('/editTask', methods=['PATCH'])
@jwt_required
def editTask():
    '''
    Edit a task
    '''
    # Validate input
    requiredParameters = ["taskId"]
    optionalParameters = ["title", "categoryId", "description", "recommendedPrice", "estimatedDurationMinutes",
                          "locationALongitude", "locationALatitude", "locationBLongitude",
                          "locationBLatitude", "startDate"]
    success, code, inputJSON = validateRequestJSON(request, requiredParameters, optionalParameters)
    if not success:
        return jsonify({}), code

    # Get current user
    current_user_id = get_jwt_identity()

    # Secondary specific validation
    editParams = {}

    # Get task
    task = Task.getByTaskId(inputJSON["taskId"])
    if task is None:
        return jsonify({}), 404

    if task.posterUserId is not current_user_id:
        # User does not have permission to delete the task
        return jsonify({"success": False}), 403

    # If the task exists and does not have an accepted offer
    if task and not task.isAccepted():
        # Filter out None parameters, accept None as string "None"
        for opt in optionalParameters:
            if inputJSON[opt] is not None:
                editParams[opt] = inputJSON[opt]
                if inputJSON[opt] == "None":
                    inputJSON[opt] = None
        task.edit(editParams)
        return jsonify({"success":True}), 200
    else:
        return jsonify({"success": False}), 403


@task_blueprint.route('/posterCompleted', methods=["POST"])
@jwt_required
def completeTaskPoster():
    '''
    Mark a Task as completed

    :return:
    '''
    # Validate Inputs
    requiredParameters = ["taskId"]
    optionalParameters = ["workerRating"]

    success, code, inputJSON = validateRequestJSON(request, requiredParameters, optionalParameters)
    if not success:
        return jsonify({}), code

    # Get current user
    current_user_id = get_jwt_identity()

    task = Task.getByTaskId(inputJSON["taskId"])
    if task is None:
        return jsonify({}), 404

    workerUser, success = completeDeal(task.taskId)
    if success:
        if inputJSON["workerRating"] is not None:
            task.setWorkerRating(inputJSON["workerRating"])
            workerUser.updateWorkerRating()
        return jsonify({"success": True}), 200
    else:
        return jsonify({"success": False}), 400

@task_blueprint.route('/workerCompleted', methods=["POST"])
@jwt_required
def completeTaskWorker():
    '''
    Mark a Task as completed

    :return:
    '''
    # Validate Inputs
    requiredParameters = ["taskId"]
    optionalParameters = ["posterRating"]

    success, code, inputJSON = validateRequestJSON(request, requiredParameters, optionalParameters)
    if not success:
        return jsonify({}), code

    # Get current user
    current_user_id = get_jwt_identity()

    task = Task.getByTaskId(inputJSON["taskId"])
    if task is None:
        return jsonify({}), 404

    if success:
        if inputJSON["posterRating"] is not None:
            task.setPosterRating(inputJSON["posterRating"])
            posterUser = User.getByUserId(task.posterUserId)
            posterUser.updatePosterRating()
        return jsonify({"success": True}), 200
    else:
        return jsonify({"success": False}), 400