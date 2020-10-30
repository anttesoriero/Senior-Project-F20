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