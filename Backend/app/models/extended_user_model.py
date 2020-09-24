'''


@author Matthew Schofield
@version 9.22.2020
'''
# Library imports
from werkzeug.security import generate_password_hash, check_password_hash

# Module imports
from app import db


class ExtendedUser(db.Model):
    '''
    Column definitions

    '''
    extendedUserId = db.Column(db.Integer(), primary_key=True)
    userId = db.Column(db.Integer(), db.ForeignKey("user.userId"),  primary_key=True)

