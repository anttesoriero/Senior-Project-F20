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
from app.utilities.validation.validation import validateRequestJSON

# Model imports
from app.models.offer_model import Offer
from app.models.task_model import Task

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

    offer = Offer.getOffer(offerId)

    if offer is None:
        return jsonify({"success": False}), 404

    task = Task.getByTaskId(offer.offerId)

    curr = get_jwt_identity()

    if (not task.posterUserId is curr) or (not offer.userIdFrom is curr):
        return jsonify({"success": False, "message": "Not posting user"}), 401


    return jsonify(offer.getInfo()), 200

@offer_blueprint.route('/getOffers', methods=['GET'])
@jwt_required
def getOffers():
    '''
    '''
    # Validate inputs
    taskId = request.args.get('taskId', type=int)
    includeArchived = request.args.get('includeArchived', False, type=bool)

    task = Task.getByTaskId(taskId)

    if task is None:
        return jsonify({"success": False, "message": "Task is missing"}), 404

    if not task.posterUserId is get_jwt_identity():
        return jsonify({"success": False, "message": "Not posting user"}), 401

    # Get offers
    offerIds = Offer.getOffersForTask(taskId, includeArchived)

    return jsonify({"offerIds": offerIds}), 200

'''
POSTs
'''
@offer_blueprint.route('/createOffer', methods=['POST'])
@jwt_required
def createOffer():
    '''
    '''
    # Validate input
    requiredParameters = ["taskId", "payment", "startDate", "jobDurationMinutes"]
    optionalParameters = ["note"]

    success, code, inputJSON = validateRequestJSON(request, requiredParameters, optionalParameters)
    if not success:
        return jsonify({}), code

    # Check Task
    task = Task.getByTaskId(inputJSON["taskId"])

    if task is None:
        return jsonify({"success": False, "message": "This offer's associated task is missing"}), 404

    if task.isAccepted():
        return jsonify({"success": False, "message": "Task already accepted"}), 400

    # Get current user
    current_user_id = get_jwt_identity()

    offer = Offer.createOffer(
        taskId=inputJSON["taskId"],
        userIdFrom=current_user_id,
        payment=inputJSON["payment"],
        startDate=inputJSON["startDate"],
        jobDurationMinutes=inputJSON["jobDurationMinutes"],
        note=inputJSON["note"]
    )

    # Build output
    output = {
        "offerId": offer.offerId
    }

    return jsonify(output), 200

@offer_blueprint.route('/acceptOffer', methods=['POST'])
@jwt_required
def acceptOffer():
    '''
    '''
    # Validate input
    requiredParameters = ["offerId"]
    optionalParameters = ["responseMessage"]

    success, code, inputJSON = validateRequestJSON(request, requiredParameters, optionalParameters)
    if not success:
        return jsonify({}), code

    # Check offer
    offer = Offer.getOffer(inputJSON["offerId"])

    if offer is None:
        return jsonify({"success": False, "message": "Offer not found"}), 404

    if offer.archived:
        return jsonify({"success": False, "message": "Offer is archived"}), 403

    if offer.accepted:
        return jsonify({"success": False, "message": "Offer is already accepted"})

    # Check Task
    task = Task.getByTaskId(offer.taskId)

    if task is None:
        return jsonify({"success": False, "message": "This offer's associated task is missing"}), 400

    currentUserId = get_jwt_identity()
    if task.posterUserId is not currentUserId:
        return jsonify({"success": False, "message": "Not the posting user"}), 401

    # TODO, atomize db commits better, right now there are two seperate commits that COULD cause issues
    task.acceptOffer(offer)
    offer.accept(inputJSON["responseMessage"])

    return jsonify({"success": True}), 200

@offer_blueprint.route('/rejectOffer', methods=['POST'])
@jwt_required
def rejectOffer():
    '''
    '''
    # Validate input
    requiredParameters = ["offerId"]
    optionalParameters = ["responseMessage"]

    success, code, inputJSON = validateRequestJSON(request, requiredParameters, optionalParameters)
    if not success:
        return jsonify({}), code

    # Check offer
    offer = Offer.getOffer(inputJSON["offerId"])

    if offer is None:
        return jsonify({"success": False, "message": "Offer not found"}), 404

    if offer.archived:
        return jsonify({"success": False, "message": "Offer is archived"}), 403

    if offer.accepted:
        return jsonify({"success": False, "message": "Offer is already accepted"})

    # Check Task
    task = Task.getByTaskId(offer.taskId)

    if task is None:
        return jsonify({"success": False, "message": "This offer's associated task is missing"}), 400

    currentUserId = get_jwt_identity()
    if task.posterUserId is not currentUserId:
        return jsonify({"success": False, "message": "Not the posting user"}), 401

    # TODO, atomize db commits better, right now there are two seperate commits that COULD cause issues
    offer.reject(inputJSON["responseMessage"])

    return jsonify({"success": True}), 200

@offer_blueprint.route('/retractOffer', methods=['POST'])
@jwt_required
def retractOffer():
    '''
    '''
    requiredParameters = ["offerId"]
    optionalParameters = []

    success, code, inputJSON = validateRequestJSON(request, requiredParameters, optionalParameters)
    if not success:
        return jsonify({}), code

    # Check offer
    offer = Offer.getOffer(inputJSON["offerId"])

    if offer is None:
        return jsonify({"success": False, "message": "Offer not found"}), 404

    if offer.archived:
        return jsonify({"success": False, "message": "Offer is archived"}), 403

    if offer.accepted:
        return jsonify({"success": False, "message": "Offer is already accepted"})

    Offer.deleteOffer(offer)

    return jsonify({"success": True}), 200
