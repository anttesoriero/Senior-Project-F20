"""
Defines routes for the endpoints related to a user's own account operations

! Try to use utilities outside of this file to do the heavy lifting !
This file should be focused on annotating routes

@author Matthew Schofield
@version 11.11.2020
"""
# Library imports
from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

# Module imports
from app.routes.me import me_blueprint
from app.utilities.validation.validation import validateRequestJSON
from app import blacklist
from app import check_if_token_in_blacklist

# Model imports
from app.models.user_model import User
from app.models.report_model import Report

'''
GETs
'''
@me_blueprint.route('/getProfile', methods=['GET'])
@jwt_required
def getProfile():
    '''
    Gets a users own profile information

    :return: profile information of a user
        see dictionary below
    '''
    # Get current user
    current_user_id = get_jwt_identity()
    user = User.getByUserId(current_user_id)

    if user is None:
        return jsonify({}), 400

    # Construct User information
    responseInformation = user.getPublicInfo()
    responseInformation["accountBalance"] = float(user.getAccountBalance())

    responseInformation["address"] = user.address

    return jsonify(responseInformation), 200

@me_blueprint.route('/getPostedTasks', methods=['GET'])
@jwt_required
def getPostedTasks():
    '''
    Gets a users posted tasks

    :return: list of posted task IDs
    {
        tasks: [Task], list of Tasks that the user has posted
    }
    '''
    # Get current user
    current_user_id = get_jwt_identity()
    
    # Get user's task ids
    tasks = User.getPostedTasks(current_user_id)
    # Format output
    responseInformation = {
        "tasks": tasks
    }

    return jsonify(responseInformation), 200

@me_blueprint.route('/getMyOffers', methods=['GET'])
@jwt_required
def getMyOffers():
    '''
    Get my offers

    :return:
    '''

    # Get current user
    current_user_id = get_jwt_identity()

    responseInformation = User.getOffers(current_user_id)
    # Format output

    return jsonify(responseInformation), 200


'''
PUTs
'''
@me_blueprint.route('/editInformation', methods=['PUT'])
@jwt_required
def editInformation():
    '''
    Sets users information change

    :return:
    {
        "message": str, success message
    }
    '''
    # Validate input
    success, code, inputJSON = validateRequestJSON(request, [], 
                                ["email", "firstName", "lastName", "preferredName", "phoneNumber", "profilePicture",
                                 "bio", "address"])
    if not success:
        return jsonify({}), code

    # Get current user
    current_user_id = get_jwt_identity()
    user = User.getByUserId(current_user_id)

    # Iterate through parameters
    # inputKeys = inputJSON.keys()
    if inputJSON["firstName"] != None:
        user.setFirstName(inputJSON["firstName"])
    if inputJSON["lastName"] != None:
        user.setLastName(inputJSON["lastName"])
    if inputJSON["email"] != None:
        user.setEmail(inputJSON["email"])
    if inputJSON["preferredName"] != None:
        user.setPreferredName(inputJSON["preferredName"])
    if inputJSON["phoneNumber"] != None:
        user.setPhoneNumber(inputJSON["phoneNumber"])
    if inputJSON["profilePicture"] != None:
        user.setProfilePicture(inputJSON["profilePicture"])
    if inputJSON["bio"] != None:
        user.setBio(inputJSON["bio"])
    if inputJSON["address"] != None:
        user.setAddress(inputJSON["address"])

    return jsonify(message="New user information successfully set"), 200

'''
DELETES
'''
@me_blueprint.route('/deleteAccount', methods=['DELETE'])
@jwt_required
def deleteAccount():
    '''
    Deletes a user from the database

    :return:
    {
        status message of the delete operation
    }
    '''
    # Get current user
    current_user_id = get_jwt_identity()

    # Get user's task ids
    User.deleteUser(current_user_id)

    # Format output
    responseInformation = {
        'message': 'user deleted'
    }
    return jsonify(responseInformation), 200


'''
PUTs
'''
@me_blueprint.route('/reportUser', methods=['PUT'])
@jwt_required
def reportUser():
    '''
    Reports a user from the database
    '''
    # Validate input
    requiredParameters = ["userId_2", "reportType", "description"]

    optionalParameters = []

    success, code, inputJSON = validateRequestJSON(request, requiredParameters, optionalParameters)
    if not success:
        return jsonify({}), code

    # Get current user
    userId_1 = get_jwt_identity()
    # Get user being reported
    userId_2 = User.getByUserId(int(inputJSON["userId_2"]))

    if userId_1 == int(inputJSON["userId_2"]):
        return jsonify({}), 400

    if userId_2 is not None:
        Report.createReport(userId_1, userId_2.userId, inputJSON["reportType"], inputJSON["description"])
        return jsonify({"success": True}), 200
    else:
        return jsonify({}), 404