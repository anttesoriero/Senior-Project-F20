"""
Defines routes for the auth (Authentication) endpoints

Try to use utilities outside of this file to do the heavy lifting
This file should be focused on annotating routes

@author Matthew Schofield
@version 9.12.2020
"""
# Library imports
from flask import jsonify, request
from flask_jwt_extended import create_access_token

from werkzeug.security import generate_password_hash, check_password_hash

# Module imports
from app.auth import auth_blueprint

# Database Models
from app import db
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
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    email = request.json.get('email', None)
    password = request.json.get('password', None)

    if not email:
        return jsonify({"msg": "Missing email parameter"}), 400
    if not password:
        return jsonify({"msg": "Missing password parameter"}), 400

    user = User.query.filter_by(
        email=email
    ).first()

    if user and check_password_hash(user.password_hash, password):
        access_token = create_access_token(identity=user.id)
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
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    email = request.json.get('email', None)
    password = request.json.get('password', None)
    if not email:
        return jsonify({"msg": "Missing email parameter"}), 400
    if not password:
        return jsonify({"msg": "Missing password parameter"}), 400

    user = User.query.filter_by(
        email=email
    ).first()

    if not user:
        user = User(
            email=email,
            password_hash=generate_password_hash(password)
        )

        db.session.add(user)
        db.session.commit()

        # generate the auth token
        auth_token = create_access_token(identity=user.id)
        responseObject = {
            'status': 'success',
            'message': 'Successfully registered.',
            'auth_token': auth_token
        }
        return jsonify(responseObject), 201
    else:
        responseObject = {
            'status': 'fail',
            'message': 'Email already exists. Please Log in.',
        }
        return jsonify(responseObject), 202
