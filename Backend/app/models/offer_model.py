'''
Offer's model for database

@author Matthew Schofield
@version 9.23.2020
'''
# Module imports
from app import db

# Models imports
from app.models.user_model import User

class Offer(db.Model):
    '''
    Column definitions

    '''
    # Column definitions
    offerId = db.Column(db.Integer(), primary_key=True)
    taskId = db.Column(db.Integer(), db.ForeignKey("task.taskId"), index=True)
    userIdFrom = db.Column(db.Integer(), db.ForeignKey("user.userId"), index=True)
    payment = db.Column(db.Integer())
    startDate = db.Column(db.DateTime(), nullable=True)
    jobDurationMinutes = db.Column(db.Integer(), nullable=True)
    note = db.Column(db.Text(240), nullable=True)
    accepted = db.Column(db.Boolean())
    responseMessage = db.Column(db.Text(240), nullable=True)

