'''
Task's model for database

These are Tasks that Users post

@author Matthew Schofield
@version 9.25.2020
'''
# Module imports
from app import db

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
            "categoryId": self.categoryId
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

        return task

    @classmethod
    def createTask(cls, posterUserId, categoryId, title, description=None):
        '''
        Creates a Task

        '''
        # Create Task
        task = Task(posterUserId=posterUserId, categoryId=categoryId, title=title, description=description)

        # Save User to database
        db.session.add(task)
        db.session.commit()
        return task
