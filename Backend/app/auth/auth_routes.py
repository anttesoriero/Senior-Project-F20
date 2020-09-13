"""
Defines routes for the auth (Authentication) endpoints

Try to use utilities outside of this file to do the heavy lifting
This file should be focused on annotating routes

@author Matthew Schofield
@version 9.13.2020
"""
# Library imports
from flask import jsonify, request
from flask_jwt_extended import create_access_token

# Module imports
from app.auth import auth_blueprint
from app.utilities.validation import validateRequestJSON

# Database Models
from app.models.user_model import User

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
    formattedJSON = validateRequestJSON(request, ["email", "password"], [])
    if not formattedJSON["_formatSuccess"]:
        return formattedJSON

    # Get User
    user = User.getByEmail(formattedJSON["email"])

    # If user exists check their credentials
    if user and user.checkCredentials(formattedJSON["password"]):
        access_token = create_access_token(identity=user.user_id)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"msg": "Bad username or password"}), 401

@auth_blueprint.route('/register', methods=['POST'])
def register():
    '''
    OPEN Endpoint

    Register a new user

    :param email: email of the new user
    :param password: password for the new user
    :return:
    '''
    # Validate input
    formattedJSON = validateRequestJSON(request, ["email", "password"], [])
    if not formattedJSON["_formatSuccess"]:
        return formattedJSON

    # Create user
    if User.createUser(
        email=formattedJSON["email"],
        password=formattedJSON["password"]
    ):
        response = {
            'message': 'Successfully registered.'
        }
        return jsonify(response), 201
    else:
        response = {
            'message': 'Failed to register',
        }
        return jsonify(response), 202
