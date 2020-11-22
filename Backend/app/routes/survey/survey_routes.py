"""
Defines routes for survey related endpoints
! Try to use utilities outside of this file to do the heavy lifting !

This file should be focused on annotating routes

@author Matthew Schofield, Steven Jiang, Jasdip Dhillon
@version 11.11.2020
"""
# Library imports
from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
import random

# Module imports
from app.routes.survey import survey_blueprint
from app.utilities.validation.validation import validateRequestJSON

# Model imports
from app.models.user_model import User
from app.models.survey_model import Survey
from app.models.historical_survey_model import HistoricalSurvey
from app.routes.survey.survey_recommender import survey_recommender

'''
GETs
'''
@survey_blueprint.route('/getSurvey', methods=['GET'])
@jwt_required
def getSurvey():
    '''
    Get a survey by surveyId

    In:
    <surveyId int>

    Out:
    {
        "type": str
        "surveyId": int
        "active": bool
        "question": str
        "answerA": str
        "answerB": str
        "answerC": str
        "answerD": str
        "answerE": str
        "answerF": str
    }
    '''
    # Validate inputs
    surveyId = request.args.get('surveyId', type=int)

    # Get task
    survey = Survey.getBySurveyId(surveyId)
    if survey is None:
        return jsonify({"success":False}), 404

    # Get survey's public information
    responseInformation = survey.getPublicInfo()

    # Send info
    return jsonify(responseInformation), 200

@survey_blueprint.route('/recommendSurvey', methods=['GET'])
@jwt_required
def recommendSurvey():
    '''
    Recommend a survey based on randomness and EUM meta information

    In:
    ---

    Out:
    {
        "recommendSurvey": int
    }
    '''
    # Get current user
    current_user_id = get_jwt_identity()
    user = User.getByUserId(current_user_id)

    # Recommend a survey for a User
    recommended_survey = survey_recommender.recommend(user)

    survey = Survey.getBySurveyId(recommended_survey)
    return jsonify({"recommendedSurvey": survey.getPublicInfo()}), 200

'''
POSTs
'''
@survey_blueprint.route('/respond', methods=['POST'])
@jwt_required
def respond():
    '''
    Respond to a Survey as a User

    In:
    {
        "surveyId": int,
        "response": str
    }

    Out:

    '''
    # Validate input
    requiredParameters = ["surveyId", "response"]
    optionalParameters = []

    success, code, inputJSON = validateRequestJSON(request, requiredParameters, optionalParameters)
    if not success:
        return jsonify({}), code

    # Get current user
    current_user_id = get_jwt_identity()
    HistoricalSurvey.createHistoricalSurvey(current_user_id, inputJSON["surveyId"], inputJSON["response"])
    
    # Inputs overall satisfaction rating into database
    if inputJSON["surveyId"] == "10":
        rating = (ord(inputJSON["response"][0]) - 64)
        current_user = User.getByUserId(get_jwt_identity())
        current_user.extendedModel.setOverallSatisfaction(rating)

    # Inputs UI satisfaction rating into database
    if inputJSON["surveyId"] == "11":
        rating = (ord(inputJSON["response"][0]) - 64)
        current_user = User.getByUserId(get_jwt_identity())
        current_user.extendedModel.setUISatisfaction(rating)

    # Inputs security satisfaction rating into database
    if inputJSON["surveyId"] == "15":
        rating = (ord(inputJSON["response"][0]) - 64)
        current_user = User.getByUserId(get_jwt_identity())
        current_user.extendedModel.setSecuritySatisfaction(rating)

    return jsonify({"success": True}), 200
