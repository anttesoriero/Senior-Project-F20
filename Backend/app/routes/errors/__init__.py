"""
Framework for errors module

The error module handles HTTP errors that arise

@author Matthew Schofield
@version 9.11.2020
"""
# Library imports
from flask import Blueprint

# Define blueprint
errors_blueprint = Blueprint('error_handler', __name__)

# Register routes
from app.routes.errors import error_routes
