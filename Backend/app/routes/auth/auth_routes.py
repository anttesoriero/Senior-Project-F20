"""
Defines routes for the auth (Authentication) endpoints

Try to use utilities outside of this file to do the heavy lifting
This file should be focused on annotating routes

@author Matthew Schofield
@version 12.2.2020
"""
# Library imports
from flask import jsonify, request, redirect
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_raw_jwt
import datetime
import requests
import json

# Module imports
from app.routes.auth import auth_blueprint
from app.utilities.validation.validation import validateRequestJSON
from app import blacklist

# Database Models
from app.models.user_model import User

@auth_blueprint.route("/oauth", methods=['POST'])
def oauth():
    # Validate input
    success, code, inputJSON = validateRequestJSON(request, ["email", "password"],
                                                   ["firstName", "lastName", "profilePicture"])
    if not success:
        return jsonify({}), code

    # Check whether the user has already been created or not
    users_email = inputJSON["email"]
    user = User.getByEmail(users_email)

    # If user exists, just refresh their JWT token
    if user:
        # Generate JWT token
        access_token = create_access_token(identity=user.userId, expires_delta=datetime.timedelta(days=1))
        return jsonify({"success": True, "access_token": access_token}), 200
    else:
        # Create user
        user = User.createUser(
            email=users_email,
            password=inputJSON["password"],
            firstName=inputJSON["firstName"],
            lastName=inputJSON["lastName"],
            preferredName="",
            profilePicture=inputJSON["profilePicture"],
            phoneNumber=""
        )

        # Check user created
        if user is not None:
            # Generate and return JWT token
            access_token = create_access_token(identity=user.userId, expires_delta=datetime.timedelta(days=1))
            response = {
                'success': True,
                'access_token': access_token
            }
            return jsonify(response), 200
        else:
            # Send back error
            return jsonify({"success": False}), 400


@auth_blueprint.route('/login', methods=['POST'])
def login():
    '''
    OPEN endpoint

    Standard login endpoint, given a User's authentication parameters
    return a JWT authentication token.

    In:
    {
        email: str, user's email
        password: str, user's password
    }

    Out:
    Success
    {
        access_token: str, JWT access token
        success: bool
    }

    HTTP codes:
    401 - Login failed
    200 - OK
    '''
    # Validate input
    success, code, inputJSON = validateRequestJSON(request, ["email", "password"], [])

    if not success:
        return jsonify({}), code

    # Get User
    user = User.getByEmail(inputJSON["email"])

    # If user exists check their credentials
    if user and user.checkCredentials(inputJSON["password"]):
        # Generate JWT token
        access_token = create_access_token(identity=user.userId, expires_delta=datetime.timedelta(days=1))
        return jsonify({"success":True, "access_token": access_token}), 200
    else:
        # Send back error
        return jsonify({"success": False}), 401

@auth_blueprint.route('/register', methods=['POST'])
def register():
    '''
    OPEN Endpoint

    Register a new user

    In:
    {
        email: str, new user's email
        password: str, new user's password
    }

    Out:
    Success
    {
        access_token: str, JWT access token
        success: bool
    }

    HTTP codes:
    200 - OK
    400 - Bad
    '''
    # Validate input
    success, code, inputJSON = validateRequestJSON(request, ["email", "password"],
                                                   ["firstName", "lastName", "preferredName", "phoneNumber"])
    if not success:
        return jsonify({}), code

    # Create user
    user = User.createUser(
        email=inputJSON["email"],
        password=inputJSON["password"],
        firstName = inputJSON["firstName"],
        lastName = inputJSON["lastName"],
        preferredName = inputJSON["preferredName"],
        phoneNumber = inputJSON["phoneNumber"]
    )

    # Check user created
    if user is not None:
        # Generate and return JWT token
        access_token = create_access_token(identity=user.userId, expires_delta=datetime.timedelta(days=1))
        response = {
            'success': True,
            'access_token': access_token
        }
        return jsonify(response), 200
    else:
        # Failed to register
        response = {
            'success': False
        }
        return jsonify(response), 400

@auth_blueprint.route('/forgotPassword', methods=['POST'])
def forgotPassword():
    '''
    Open Endpoint

    A user has forgotten password

    In
    {
        "email": str, user's email
    }

    Out
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
@auth_blueprint.route('/logout', methods=['GET'])
@jwt_required
def logout():
    '''
    *

    Closed Endpoint

    Logout a user

    In
    None

    Out
    {
        "success": bool, whether user was logged out
    }
    '''
    jti = get_raw_jwt()['jti']
    blacklist.add(jti)
    return jsonify({"success": True}), 200


@auth_blueprint.route('/changePasswordWithAuth', methods=['POST'])
@jwt_required
def changePasswordWithAuth():
    '''
    Closed Endpoint

    Change an authenticated User's password

    :param:
    {
        "oldPassword": str, old password
        "newPassword": str, new password
    }

    :return:
    {
        "success": bool, whether user's password was changed
    }
    '''
    # Validate input
    success, code, inputJSON = validateRequestJSON(request, ["oldPassword", "newPassword"], [])
    if not success:
        return jsonify({}), code

    # get User
    user = User.getByUserId(get_jwt_identity())

    # Check that the user and password are valid
    if user and user.checkCredentials(inputJSON["oldPassword"]):
        # Change password
        user.setPassword(inputJSON["newPassword"])
        return jsonify({"success": True}), 200
    else:
        return jsonify({"success": False}), 401

