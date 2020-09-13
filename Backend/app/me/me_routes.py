"""
Defines routes for the endpoints related to a user's own account operations

! Try to use utilities outside of this file to do the heavy lifting !
This file should be focused on annotating routes

@author Matthew Schofield
@version 9.13.2020
"""
# Library imports
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

# Module imports
from app.me import me_blueprint

# Model imports
from app.models.user_model import User

@me_blueprint.route('/email', methods=['GET'])
@jwt_required
def getUserEmail():
    '''
    Gets a users own email

    :return: email of current user
    '''
    # Get current user
    current_user_id = get_jwt_identity()
    user = User.getByUserId(current_user_id)

    return jsonify(email=user.email), 200

