'''
Task's model for database

These are Tasks that Users post

@author Matthew Schofield
@version 9.25.2020
'''
# Module imports
from app import db

# Models imports
from app.models.user_model import User
from app.models.category_model import Category

class Task(db.Model):
    '''
    Column definitions

    taskId             Integer PK
    posterUserId       Integer Index
    categoryId         Integer
    description        String
    title              String
    acceptedOfferID    Integer nullable
    postedStartDate
    estimatedDuration  Integer nullable
    locationALongitude
    locationALatitude
    locationBLongitude
    locationBLatitude
    '''
    # Column definitions
    taskId = db.Column(db.Integer(), primary_key=True)
    posterUserId = db.Column(db.Integer(), db.ForeignKey("user.userId"), index=True)
    categoryId = db.Column(db.Integer(), db.ForeignKey("category.categoryId"))
    description = db.Column(db.String(300), nullable=True)
    title = db.Column(db.String(60), nullable=True)

    def getBriefPublicInfo(self):
        output = {
            "title": self.title,
            "description": self.description
        }
        return output

