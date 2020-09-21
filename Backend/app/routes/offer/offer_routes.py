"""
Defines routes for offer related endpoints

! Try to use utilities outside of this file to do the heavy lifting !
This file should be focused on annotating routes

@author Matthew Schofield
@version 9.19.2020
"""
# Library imports
from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

# Module imports
from app.routes.offer import offer_blueprint
from app.utilities.validation import validateRequestJSON

# Model imports
from app.models.user_model import User

'''
GETs
'''
@offer_blueprint.route('/getOffer', methods=['GET'])
@jwt_required
def getBriefPublic():
    '''
    '''
    # Validate inputs
    offerId = request.args.get('offerId', type=int)

    return jsonify({}), 200

'''
POSTs
'''
@offer_blueprint.route('/createOffer', methods=['POST'])
@jwt_required
def createOffer():
    '''
    '''
    # Get current user
    current_user_id = get_jwt_identity()
    user = User.getByUserId(current_user_id)

    return jsonify({}), 200

@offer_blueprint.route('/acceptOffer', methods=['POST'])
@jwt_required
def acceptOffer():
    '''
    '''
    # Get current user
    current_user_id = get_jwt_identity()
    user = User.getByUserId(current_user_id)

    return jsonify({}), 200

@offer_blueprint.route('/rejectOffer', methods=['POST'])
@jwt_required
def rejectOffer():
    '''
    '''
    # Get current user
    current_user_id = get_jwt_identity()
    user = User.getByUserId(current_user_id)

    return jsonify({}), 200

@offer_blueprint.route('/retractOffer', methods=['POST'])
@jwt_required
def retractOffer():
    '''
    '''
    # Get current user
    current_user_id = get_jwt_identity()
    user = User.getByUserId(current_user_id)

    return jsonify({}), 200

'''
DELETEs
'''
@offer_blueprint.route('/deleteOffer', methods=['DELETE'])
@jwt_required
def deleteOffer():
    '''
    '''
    offerId = request.args.get('offerId', type=int)
    # Get current user
    current_user_id = get_jwt_identity()
    user = User.getByUserId(current_user_id)

    return jsonify({}), 200
