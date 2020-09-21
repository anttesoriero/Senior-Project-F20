"""
Framework for user module

The user module is a place for endpoints that are most strongly related to users

@author Matthew Schofield
@version 9.12.2020
"""
# Library imports
from flask import Blueprint

# Initialize User Blueprint
me_blueprint = Blueprint('me', __name__)

# Register routes
from app.routes.me import me_routes