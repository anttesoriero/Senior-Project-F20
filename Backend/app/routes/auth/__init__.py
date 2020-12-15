"""
Framework for auth module

The auth module handles authentication related tasks

Example usages:
Login
Logout
Change Password
Change Email
etc.

@author Matthew Schofield
@version 9.11.2020

"""
# Library imports
from flask import Blueprint

# Define blueprint
auth_blueprint = Blueprint('auth', __name__)

# Register routes
from app.routes.auth import auth_routes
