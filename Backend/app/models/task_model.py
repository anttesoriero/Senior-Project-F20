'''
Task's model for database

These are Tasks that Users post

@author Matthew Schofield
@version 9.25.2020
'''
# Module imports
from app import db

from app.utilities.validation import validation

class Task(db.Model):
    '''
    Column definitions

    taskId             Integer PK
    posterUserId       Integer Index
    categoryId         Integer
    description        String
    title              String
    recommendedPrice   Decimal(4,2) nullable
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
    recommendedPrice = db.Column(db.Numeric(4,2), nullable=True)

    # Set-up Database Relationships
    acceptedOfferId = db.relationship('Offer', backref="offer", uselist=False)

    def isAccepted(self):
        return self.acceptedOfferId is not None

    def getBriefPublicInfo(self):
        output = {
            "taskId": self.taskId,
            "title": self.title,
            "categoryId": self.categoryId,
            "recommendedPrice": self.recommendedPrice,
            "accepted": self.isAccepted()
        }
        return output

    def getPublicInfo(self):
        output = {
            "taskId": self.taskId,
            "posterTaskId": self.posterUserId,
            "title": self.title,
            "categoryId": self.categoryId,
            "recommendedPrice": self.recommendedPrice,
            "description": self.description,
            "accepted": self.isAccepted()
        }
        return output

    @classmethod
    def getByTaskId(cls, taskId):
        '''
        Get Task by taskId

        :param taskId: taskId to get Task with
        :return: Task object connected to given taskId
        '''
        task = Task.query.filter_by(
            taskId=taskId
        ).first()

        # Pre-processing conversion
        if task.recommendedPrice is not None:
            task.recommendedPrice = float(task.recommendedPrice)

        return task

    @classmethod
    def createTask(cls, posterUserId, categoryId, title, description=None, recommendedPrice=None):
        '''
        Creates a Task

        '''

        # Create Task
        task = Task(
            posterUserId=posterUserId,
            categoryId=categoryId,
            title=title,
            description=description,
            recommendedPrice=recommendedPrice
        )

        # Save User to database
        db.session.add(task)
        db.session.commit()
        return task
