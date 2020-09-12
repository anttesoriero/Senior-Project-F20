"""
Defines routes for the main (Miscellaneous) endpoints

! Try to use utilities outside of this file to do the heavy lifting !
This file should be focused on annotating routes

@author Matthew Schofield
@version 9.11.2020
"""
# Library imports
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

# Module imports
from app.user import user_blueprint

# Model imports
from app.models.user_model import User

@user_blueprint.route('/email', methods=['GET'])
@jwt_required
def getUserEmail():
    current_user = get_jwt_identity()
    user = User.query.filter_by(
        id=current_user
    ).first()
    email=user.email
    return jsonify(email=email), 200
