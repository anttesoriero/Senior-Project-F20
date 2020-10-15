"""
Defines routes for the endpoints related to a user's own account operations

! Try to use utilities outside of this file to do the heavy lifting !
This file should be focused on annotating routes

@author Matthew Schofield
@version 9.13.2020
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

'''
GETs
'''
@me_blueprint.route('/getProfile', methods=['GET'])
@jwt_required
def getProfile():
    '''
    Gets a users own profile information

    :return: profile information of a user
    {
        email: str, email of user,
        name: str, name of user
    }
    '''
    # Get current user
    current_user_id = get_jwt_identity()
    user = User.getByUserId(current_user_id)

    responseInformation = {
        "email": user.email,
        "firstName": user.firstName,
        "lastName": user.lastName,
        "preferredName": user.preferredName,
        "accountBalance": user.getAccountBalance()
    }

    return jsonify(responseInformation), 200

@me_blueprint.route('/getPostedTasks', methods=['GET'])
@jwt_required
def getPostedTasks():
    '''
    Gets a users posted tasks

    :return: list of posted task IDs
    {
        tasks: [int], list of task IDs that the user has posted
    }
    '''
    # Get current user
    current_user_id = get_jwt_identity()
    
    # Get user's task ids
    task_ids = User.getPostedTaskIDs(current_user_id)

    # Format output
    responseInformation = {
        "taskIDs": task_ids
    }

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
        email:         str, email to set
        firstName:     str, first name to set
        lastName:      str, last name to set
        preferredName: str, preferred name to set
        phoneNumber:   str, phone number to set
    }
    '''
    # Validate input
    success, code, inputJSON = validateRequestJSON(request, [], 
                                ["email", "firstName", "lastName", "preferredName", "phoneNumber"])
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

    