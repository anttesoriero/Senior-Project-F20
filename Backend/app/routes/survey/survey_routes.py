"""
Defines routes for survey related endpoints

! Try to use utilities outside of this file to do the heavy lifting !
This file should be focused on annotating routes

@author Matthew Schofield
@version 9.21.2020
"""
# Library imports
from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

# Module imports
from app.routes.survey import survey_blueprint

# Model imports
from app.models.user_model import User


'''
GETs
'''
@survey_blueprint.route('/getSurvey', methods=['GET'])
@jwt_required
def getSurvey():
    '''
        Out:
    {
        "surveyId": int
        "active": bool
        "question": str
        "answerA": str
        "answerB": str
        "answerC": str
        "answerD": str
        "answerE": str
    }
    '''

    # Validate inputs
    surveyId = request.args.get('surveyId', type=int)

    # Get task
    survey = Survey.getBySurveyId(surveyId)
    if survey is None:
        return jsonify({"success":False}), 404

    responseInformation = survey.getPublicInfo()

    return jsonify(responseInformation), 200

@survey_blueprint.route('/recommendSurvey', methods=['GET'])
@jwt_required
def recommendSurvey():
    '''
    Return a recommended survey ID

    :return: survey ID recommendation
    '''
    # Get current user
    current_user_id = get_jwt_identity()
    user = User.getByUserId(current_user_id)

    return jsonify({"recommendedSurvey":0}), 200

'''
POSTs
'''
@survey_blueprint.route('/respond', methods=['POST'])
@jwt_required
def respond():
    '''
    '''
    # Get current user
    current_user_id = get_jwt_identity()
    user = User.getByUserId(current_user_id)

    return jsonify({}), 200

