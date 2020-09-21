"""
Defines routes for the auth (Authentication) endpoints

Try to use utilities outside of this file to do the heavy lifting
This file should be focused on annotating routes

@author Matthew Schofield
@version 9.13.2020
"""
# Library imports
from flask import jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

# Module imports
from app.routes.auth import auth_blueprint
from app.utilities.validation import validateRequestJSON

# Database Models
from app.models.user_model import User

'''
Open endpoints
'''

@auth_blueprint.route('/login', methods=['POST'])
def login():
    '''
    OPEN endpoint

    Standard login endpoint, given a User's authentication parameters
    return a JWT authentication token.

    :param email: Email associated with a User's account
    :param password: Password to User's account
    :return: JWT token for HTTP authentication
    '''
    # Validate input
    success, code, inputJSON = validateRequestJSON(request, ["email", "password"], [])
    print(success)
    print(code)
    if not success:
        return jsonify({}), code

    # Get User
    user = User.getByEmail(inputJSON["email"])

    # If user exists check their credentials
    if user and user.checkCredentials(inputJSON["password"]):
        access_token = create_access_token(identity=user.user_id)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"success": False}), 401

@auth_blueprint.route('/register', methods=['POST'])
def register():
    '''
    OPEN Endpoint

    Register a new user

    :param email: email of the new user
    :param password: password for the new user
    :return:
    {
        "success": bool, whether the user was registered
    }
    '''
    # Validate input
    success, code, inputJSON = validateRequestJSON(request, ["email", "password"], [])
    if not success:
        return jsonify({}), code

    # Create user
    if User.createUser(
        email=inputJSON["email"],
        password=inputJSON["password"]
    ):
        response = {
            'success': True
        }
        return jsonify(response), 201
    else:
        response = {
            'success': False
        }
        return jsonify(response), 202

@auth_blueprint.route('/forgotPassword', methods=['POST'])
def forgotPassword():
    '''
    Open Endpoint

    A user has forgotten password

    :param:
    {
        "email": str, user's email
    }

    :return:
    {
        "success": bool, email sent
    }
    '''
    # Validate input
    success, code, inputJSON = validateRequestJSON(request, ["email"], [])
    if not success:
        return jsonify({}), code

    return jsonify({"success": True}), 200

@auth_blueprint.route('/changePasswordFromVerification', methods=['POST'])
def changePasswordFromVerification():
    '''
    Open Endpoint

    Change a user's password using a verification token

    :param:
    {
        "email": str, user's email,
        "verificationToken": str, token sent to user's email,
        "password": str, user's new password
    }

    :return:
    {
        "success": bool, email sent
    }
    '''
    # Validate input
    success, code, inputJSON = validateRequestJSON(request, ["email", "verificationToken", "password"], [])
    if not success:
        return jsonify({}), code

    return jsonify({"success": True}), 200

'''
Protected endpoints
'''
@auth_blueprint.route('/logout', methods=['POST'])
@jwt_required
def logout():
    '''
    *

    Closed Endpoint

    Logout a user

    :return:
    {
        "success": bool, whether user was logged out
    }
    '''
    return jsonify({"success": True}), 200


@auth_blueprint.route('/changePasswordWithAuth', methods=['POST'])
@jwt_required
def changePasswordWithAuth():
    '''
    *

    Closed Endpoint

    Change a user's password

    :param:
    {
        "newPassword": str, new password
    }

    :return:
    {
        "success": bool, whether user's password was changed
    }
    '''
    # Validate input
    success, code, inputJSON = validateRequestJSON(request, ["newPassword"], [])
    if not success:
        return jsonify({}), code

    return jsonify({"success": True}), 200
