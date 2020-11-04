"""
Defines routes for admin related endpoints

! Try to use utilities outside of this file to do the heavy lifting !
This file should be focused on annotating routes

@author Matthew Schofield
@version 10.16.2020
"""
# Library imports
from flask import jsonify, request

# Module imports
from app.routes.admin import admin_blueprint
from app.utilities.validation.validation import validateRequestJSON

# Model imports
from app.models.user_model import User
from app.models.user_model import Task
from app.models.user_model import Survey
from app.models.user_model import Offer
from app.models.user_model import HistoricalSurvey
from app.models.user_model import Category

adminToken = "SuperSecureLongAdminToken"

'''
POSTs
'''
@admin_blueprint.route('/addToAccount', methods=['POST'])
def addToAccount():
    '''
    Add money to a user's account

    In:
    {
        "adminPassword": str,
        "userId": int,
        "amountToChange": int
    }
    '''

    # Validate input
    requiredParameters = ["adminPassword", "amountToChange"]

    optionalParameters = []

    success, code, inputJSON = validateRequestJSON(request, requiredParameters, optionalParameters)
    if not success:
        return jsonify({}), code

    if str(inputJSON["adminPassword"]) != adminToken:
        return jsonify({}), 403

    user = User.getByUserId(int(inputJSON["userId"]))
    if user is not None:
        user.changeAccountBalance(int(inputJSON["amountToChange"]))
        return jsonify({"success":True}), 200
    else:
        return jsonify({}), 404

'''
POST
'''
@admin_blueprint.route('/getAllUsers', methods=['POST'])
def getAllUsers():
    '''
    Returns all user Id's
    '''
    # Validate input
    requiredParameters = ["adminPassword"]

    optionalParameters = []

    success, code, inputJSON = validateRequestJSON(request, requiredParameters, optionalParameters)
    if not success:
        return jsonify({}), code

    if str(inputJSON["adminPassword"]) != adminToken:
        return jsonify({}), 403

    return jsonify({"User ID":User.getUserIDs()}), 200

'''
POST
'''
@admin_blueprint.route('/getAllTasks', methods=['POST'])
def getAllTasks():
    '''
    Returns all task Id's
    '''
    # Validate input
    requiredParameters = ["adminPassword"]

    optionalParameters = []

    success, code, inputJSON = validateRequestJSON(request, requiredParameters, optionalParameters)
    if not success:
        return jsonify({}), code

    if str(inputJSON["adminPassword"]) != adminToken:
        return jsonify({}), 403

    return jsonify({"Task ID":Task.getTaskIDs()}), 200
    
'''
POST
'''
@admin_blueprint.route('/getAllSurveys', methods=['POST'])
def getAllSurveys():
    '''
    Returns all survey Id's
    '''
    # Validate input
    requiredParameters = ["adminPassword"]

    optionalParameters = []

    success, code, inputJSON = validateRequestJSON(request, requiredParameters, optionalParameters)
    if not success:
        return jsonify({}), code

    if str(inputJSON["adminPassword"]) != adminToken:
        return jsonify({}), 403

    return jsonify({"Survey ID":Survey.getSurveyIDs()}), 200

'''
POST
'''
@admin_blueprint.route('/getAllOffers', methods=['POST'])
def getAllOffers():
    '''
    Returns all offer Id's
    '''
    # Validate input
    requiredParameters = ["adminPassword"]

    optionalParameters = []

    success, code, inputJSON = validateRequestJSON(request, requiredParameters, optionalParameters)
    if not success:
        return jsonify({}), code

    if str(inputJSON["adminPassword"]) != adminToken:
        return jsonify({}), 403

    return jsonify({"Offer ID":Offer.getOfferIDs()}), 200

'''
POST
'''
@admin_blueprint.route('/getAllHistoricalSurveys', methods=['POST'])
def getAllHistoricalSurveys():
    '''
    Returns all historicalSurvey Id's
    '''
    # Validate input
    requiredParameters = ["adminPassword"]

    optionalParameters = []

    success, code, inputJSON = validateRequestJSON(request, requiredParameters, optionalParameters)
    if not success:
        return jsonify({}), code

    if str(inputJSON["adminPassword"]) != adminToken:
        return jsonify({}), 403

    return jsonify({"HistoricalSurvey ID":HistoricalSurvey.getHistoricalSurveyIDs()}), 200

'''
POST
'''
@admin_blueprint.route('/getAllCategories', methods=['POST'])
def getAllCategories():
    '''
    Returns all category Id's
    '''
    # Validate input
    requiredParameters = ["adminPassword"]

    optionalParameters = []

    success, code, inputJSON = validateRequestJSON(request, requiredParameters, optionalParameters)
    if not success:
        return jsonify({}), code

    if str(inputJSON["adminPassword"]) != adminToken:
        return jsonify({}), 403

    return jsonify({"Category ID":Category.getCategoryIDs()}), 200

'''
POST
'''
@admin_blueprint.route('/changeAdminToken', methods=['POST'])
def changeAdminToken():
    '''
    Given the old admin token, admin is able to change
    to a new admin token.

    In:
    {
        adminPassword: str, current admin password
        new_adminPassword: str, new admin password
    }
    '''
   
    global adminToken

    # Validate input
    requiredParameters = ["adminPassword", "new_adminPassword"]

    optionalParameters = []
    
    success, code, inputJSON = validateRequestJSON(request, requiredParameters, optionalParameters)
    if not success:
        return jsonify({}), code

    if str(inputJSON["adminPassword"]) != adminToken:
        return jsonify({}), 403
    
    adminToken = str(inputJSON["new_adminPassword"])
    response = {
        "success": True,
        "adminToken": adminToken
    }
    return jsonify(response), 200
    