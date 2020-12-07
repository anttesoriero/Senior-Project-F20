"""
Defines routes for admin related endpoints

! Try to use utilities outside of this file to do the heavy lifting !
This file should be focused on annotating routes

@author Matthew Schofield
@version 11.11.2020
"""
# Library imports
from flask import jsonify, request

# Module imports
from app.routes.admin import admin_blueprint
from app.utilities.validation.validation import validateRequestJSON

# Model imports
from app.models.user_model import User
from app.models.task_model import Task
from app.models.survey_model import Survey
from app.models.offer_model import Offer
from app.models.historical_survey_model import HistoricalSurvey
from app.models.category_model import Category
from app.models.report_model import Report

# Static password for admin queries
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

    Out:
    {
        "success": bool
    }
    '''
    # Validate input
    requiredParameters = ["adminPassword", "amountToChange", "userId"]
    optionalParameters = []

    success, code, inputJSON = validateRequestJSON(request, requiredParameters, optionalParameters)
    if not success:
        return jsonify({}), code

    if str(inputJSON["adminPassword"]) != adminToken:
        return jsonify({}), 403

    # Get User
    user = User.getByUserId(int(inputJSON["userId"]))

    # If User was found execute command, otherwise 404
    if user is not None:
        user.changeAccountBalance(int(inputJSON["amountToChange"]))
        return jsonify({"success": True}), 200
    else:
        return jsonify({}), 404

@admin_blueprint.route('/getAllUsers', methods=['POST'])
def getAllUsers():
    '''
    Returns all Users
    '''
    # Validate input
    requiredParameters = ["adminPassword"]
    optionalParameters = []

    success, code, inputJSON = validateRequestJSON(request, requiredParameters, optionalParameters)
    if not success:
        return jsonify({}), code

    # Check Admin token
    if str(inputJSON["adminPassword"]) != adminToken:
        return jsonify({}), 403

    # Return all Users
    return jsonify({"users": User.getAll()}), 200

@admin_blueprint.route('/getAllTasks', methods=['POST'])
def getAllTasks():
    '''
    Returns all Tasks
    '''
    # Validate input
    requiredParameters = ["adminPassword"]

    optionalParameters = []

    success, code, inputJSON = validateRequestJSON(request, requiredParameters, optionalParameters)
    if not success:
        return jsonify({}), code

    # Check Admin token
    if str(inputJSON["adminPassword"]) != adminToken:
        return jsonify({}), 403

    return jsonify({"tasks": Task.getAll()}), 200

@admin_blueprint.route('/getAllSurveys', methods=['POST'])
def getAllSurveys():
    '''
    Returns all Surveys
    '''
    # Validate input
    requiredParameters = ["adminPassword"]

    optionalParameters = []

    success, code, inputJSON = validateRequestJSON(request, requiredParameters, optionalParameters)
    if not success:
        return jsonify({}), code

    # Check Admin token
    if str(inputJSON["adminPassword"]) != adminToken:
        return jsonify({}), 403

    return jsonify({"surveys": Survey.getAll()}), 200

@admin_blueprint.route('/getAllOffers', methods=['POST'])
def getAllOffers():
    '''
    Returns all Offers
    '''
    # Validate input
    requiredParameters = ["adminPassword"]

    optionalParameters = []

    success, code, inputJSON = validateRequestJSON(request, requiredParameters, optionalParameters)
    if not success:
        return jsonify({}), code

    # Check Admin token
    if str(inputJSON["adminPassword"]) != adminToken:
        return jsonify({}), 403

    return jsonify({"offers": Offer.getAll()}), 200

@admin_blueprint.route('/getAllHistoricalSurveys', methods=['POST'])
def getAllHistoricalSurveys():
    '''
    Returns all HistoricalSurveys
    '''
    # Validate input
    requiredParameters = ["adminPassword"]

    optionalParameters = []

    success, code, inputJSON = validateRequestJSON(request, requiredParameters, optionalParameters)
    if not success:
        return jsonify({}), code

    # Check Admin token
    if str(inputJSON["adminPassword"]) != adminToken:
        return jsonify({}), 403

    return jsonify({"historicalSurveys": HistoricalSurvey.getAll()}), 200

@admin_blueprint.route('/getAllCategories', methods=['POST'])
def getAllCategories():
    '''
    Returns all Categories
    '''
    # Validate input
    requiredParameters = ["adminPassword"]

    optionalParameters = []

    success, code, inputJSON = validateRequestJSON(request, requiredParameters, optionalParameters)
    if not success:
        return jsonify({}), code

    # Check admin token
    if str(inputJSON["adminPassword"]) != adminToken:
        return jsonify({}), 403

    return jsonify({"categories": Category.getAll()}), 200

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

    Out:
    {
        success: bool, whether the change was a success
        adminToken: new admin token
    }
    '''
   
    global adminToken

    # Validate input
    requiredParameters = ["adminPassword", "new_adminPassword"]

    optionalParameters = []
    
    success, code, inputJSON = validateRequestJSON(request, requiredParameters, optionalParameters)
    if not success:
        return jsonify({}), code

    # Check admin token
    if str(inputJSON["adminPassword"]) != adminToken:
        return jsonify({}), 403

    # Respond with new admin token
    adminToken = str(inputJSON["new_adminPassword"])
    response = {
        "success": True,
        "adminToken": adminToken
    }
    return jsonify(response), 200


@admin_blueprint.route('/getAllReports', methods=['POST'])
def getAllReports():
    '''
    Returns all Offers
    '''
    # Validate input
    requiredParameters = ["adminPassword"]

    optionalParameters = []

    success, code, inputJSON = validateRequestJSON(request, requiredParameters, optionalParameters)
    if not success:
        return jsonify({}), code

    # Check Admin token
    if str(inputJSON["adminPassword"]) != adminToken:
        return jsonify({}), 403

    return jsonify({"reports": Report.getAll()}), 200