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
from app.routes.user import user_blueprint

# Model imports
from app.models.user_model import User

@user_blueprint.route('/getBriefProfile', methods=['GET'])
@jwt_required
def getBriefProfile():
    '''
    Gets a brief profile about a user

    :return: brief profile about a given user
    see output of User.getBriefPublicInfo()
    '''
    # # Validate inputs
    # otherUserId = request.args.get('otherUser', type=int)

    # # Get models
    # otherUser = User.getByUserId(otherUserId)

    current_user_id = get_jwt_identity()
    user = User.getByUserId(current_user_id)
    if not user:
        return jsonify(message="user not found"), 404

    responseInformation = user.getBriefPublicInfo()
    return jsonify(responseInformation), 200

@user_blueprint.route('/getProfile', methods=['GET'])
@jwt_required
def getProfile():
    '''
    Gets an in-depth profile about a user

    :return: profile about a given user
    see output of User.getPublicInfo()
    '''
    # # Validate inputs
    # otherUserId = request.args.get('otherUser', type=int)

    # # Get models
    # otherUser = User.getByUserId(otherUserId)

    current_user_id = get_jwt_identity()
    user = User.getByUserId(current_user_id)
    if not user:
        return jsonify(message="user not found"), 404

    responseInformation = user.getPublicInfo()
    return jsonify(responseInformation), 200
