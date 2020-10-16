"""
Framework for main module

The admin module is intended to high priviledge low level operations

@author Matthew Schofield
@version 10.16.2020
"""
# Library imports
from flask import Blueprint

# Initialize Main Blueprint
admin_blueprint = Blueprint('admin', __name__)

# Register routes
from app.routes.admin import admin_routes