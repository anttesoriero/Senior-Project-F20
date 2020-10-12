'''
Stores specific information for informing the service more
deeply about the User

TODO:
Check userId, it may not need primary_key=True

@author Matthew Schofield
@version 10.11.2020
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
    # Column definitions
    extendedUserId = db.Column(db.Integer(), primary_key=True)
    userId = db.Column(db.Integer(), db.ForeignKey("user.userId"), primary_key=True)
    gender = db.Column(db.Integer(), nullable=True)
    age = db.Column(db.Integer(), nullable=True)
    locationInterestedInALongitude = db.Column(db.Numeric(9, 6), nullable=True)
    locationInterestedInALatitude = db.Column(db.Numeric(9, 6), nullable=True)
    locationInterestedInBLongitude = db.Column(db.Numeric(9, 6), nullable=True)
    locationInterestedInBLatitude = db.Column(db.Numeric(9, 6), nullable=True)
    pricePerDrivingMinute = db.Column(db.Numeric(10, 2), nullable=True)
    posterPreference = db.Column(db.Integer(), nullable=True)
