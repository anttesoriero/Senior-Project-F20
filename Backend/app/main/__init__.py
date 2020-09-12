"""
Framework for main module

The main module is a place for endpoints that are awaiting a more specific home

@author Matthew Schofield
@version 9.11.2020
"""
# Library imports
from flask import Blueprint

# Initialize Main Blueprint
main_blueprint = Blueprint('main', __name__)

# Register routes
from app.main import main_routes