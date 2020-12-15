"""
Defines error handlers for the broader application

:author: Matthew Schofield
:version: 9.12.2020
"""
# Library imports
from flask import jsonify

# Module imports
from app.routes.errors import errors_blueprint

@errors_blueprint.app_errorhandler(404)
def handle_exception(e):
    '''
    Generic error handling
    HTTP and Server errors

    :param e: error object
    :return: JSON reporting 404 error
    {
        "code": int error code,
        "name": str name of error
    }
    '''
    response = jsonify(
        code=e.code,
        name=e.name
    )
    response.content_type = "application/json"
    return response, e.code

@errors_blueprint.app_errorhandler(401)
def handle_exception(e):
    '''
    Generic error handling
    HTTP and Server errors

    :param e: error object
    :return: JSON reporting 404 error
    {
        "code": int error code,
        "name": str name of error
    }
    '''
    response = jsonify(
        code=e.code,
        name=e.name
    )
    response.content_type = "application/json"
    return response, e.code