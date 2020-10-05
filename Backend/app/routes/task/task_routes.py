"""
Defines routes for the main (Miscellaneous) endpoints

! Try to use utilities outside of this file to do the heavy lifting !
This file should be focused on annotating routes

@author Matthew Schofield
@version 9.20.2020
"""
# Library imports
from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

# Module imports
from app.routes.task import task_blueprint
from app.utilities.validation.validation import validateRequestJSON

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

    ?
    taskId=<taskId>

    Out:
    {
        "accepted": bool
        "categoryId": int
        "description": str
        "posterTaskId": int
        "recommendedPrice": float, nullable
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
    responseInformation = task.getPublicInfo()

    return jsonify(responseInformation), 200


@task_blueprint.route('/getBriefPrivate', methods=['GET'])
@jwt_required
def getBriefPrivate():
    '''
    '''
    # Validate inputs
    taskId = request.args.get('taskId', type=int)
    current_user_id = get_jwt_identity()

    return jsonify({}), 200


@task_blueprint.route('/getPrivate', methods=['GET'])
@jwt_required
def getPrivate():
    '''
    '''
    # Validate inputs
    taskId = request.args.get('taskId', type=int)
    current_user_id = get_jwt_identity()

    return jsonify({}), 200

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

    return jsonify({"recommendedTasks":[]}), 200

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
        *"recommendedPrice": float
    }
    Out
    {
        "taskId": int
    }
    '''
    # Validate input
    requiredParameters = ["categoryId", "title"]
    optionalParameters = ["description", "recommendedPrice"]
    success, code, inputJSON = validateRequestJSON(request, requiredParameters, optionalParameters)
    if not success:
        return jsonify({}), code

    # Get current user
    current_user_id = get_jwt_identity()
    user = User.getByUserId(current_user_id)

    # Create task
    task = Task.createTask(
        posterUserId=user.userId,
        categoryId=inputJSON["categoryId"],
        title=inputJSON["title"],
        description=inputJSON["description"],
        recommendedPrice=inputJSON["recommendedPrice"]
    )

    # Build output
    output = {
        "taskId": task.taskId
    }

    return jsonify(output), 200


'''
DELETEs
'''
@task_blueprint.route('/deleteTask', methods=['DELETE'])
@jwt_required
def deleteTask():
    '''
    '''
    taskId = request.args.get('taskId', type=int)
    # Get current user
    current_user_id = get_jwt_identity()
    user = User.getByUserId(current_user_id)

    return jsonify({}), 200

'''
PUTs
'''
@task_blueprint.route('/putTask', methods=['PUT'])
@jwt_required
def editTask():
    '''
    '''
    return jsonify({}), 200