'''
Stores specific information for informing the service more
deeply about the User

TODO:
Check userId, it may not need primary_key=True

@author Matthew Schofield
@version 9.25.2020
'''
# Library imports
# Place holding

# Module imports
from app import db

class ExtendedUser(db.Model):
    '''
    Column definitions
    extendedUserId
    userId

    Connections
    User table, userId
    '''
    extendedUserId = db.Column(db.Integer(), primary_key=True)
    userId = db.Column(db.Integer(), db.ForeignKey("user.userId"), primary_key=True)

