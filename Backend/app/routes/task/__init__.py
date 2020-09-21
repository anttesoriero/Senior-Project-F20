"""
Framework for task module

Handle requests focused on tasks

@author Matthew Schofield
@version 9.20.2020
"""
# Library imports
from flask import Blueprint

# Initialize Task Blueprint
task_blueprint = Blueprint('task', __name__)

# Register routes
from app.routes.task import task_routes