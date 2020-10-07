'''
Task's model for database

These are Tasks that Users post

@author Matthew Schofield
@version10.7.2020
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
    estimatedDurationMinutes = db.Column(db.Integer(), nullable=True)
    locationALongitude = db.Column(db.Numeric(7,5), nullable=True)
    locationALatitude = db.Column(db.Numeric(7,5), nullable=True)
    locationBLongitude = db.Column(db.Numeric(7,5), nullable=True)
    locationBLatitude = db.Column(db.Numeric(7,5), nullable=True)


    # Set-up Database Relationships
    acceptedOfferId = db.relationship('Offer', backref="offer", uselist=False)

    '''
    Read
    '''
    def isAccepted(self):
        return self.acceptedOfferId is not None

    def getBriefPublicInfo(self):
        '''
        Package brief public information about a Task

        :return: Brief public information about a Task
        '''
        recommendedPrice = str("%.2f" % self.recommendedPrice) if self.recommendedPrice else None
        output = {
            "taskId": self.taskId,
            "title": self.title,
            "categoryId": self.categoryId,
            "recommendedPrice": recommendedPrice,

            "accepted": self.isAccepted()
        }
        return output

    def getPublicInfo(self):
        '''

        :return:
        '''
        # Strip latitude and longitudes to only 2 decimals
        locationALongitude = str("%.1f" % self.locationALongitude) if self.locationALongitude else None
        locationALatitude = str("%.1f" % self.locationALongitude) if self.locationALongitude else None
        locationBLongitude = str("%.1f" % self.locationBLongitude) if self.locationBLongitude else None
        locationBLatitude = str("%.1f" % self.locationBLatitude) if self.locationBLatitude else None
        recommendedPrice = str("%.2f" % self.recommendedPrice) if self.recommendedPrice else None

        output = {
            "taskId": self.taskId,
            "posterTaskId": self.posterUserId,
            "description": self.description,
            "title": self.title,
            "categoryId": self.categoryId,
            "recommendedPrice": recommendedPrice,
            "accepted": self.isAccepted(),
            "estimatedDurationMinutes": self.estimatedDurationMinutes,
            "locationALongitude": locationALongitude,
            "locationALatitude": locationALatitude,
            "locationBLongitude": locationBLongitude,
            "locationBLatitude": locationBLatitude
        }
        return output

    '''
    Update
    '''
    def editParams(self, paramDict):
        k = paramDict.keys()
        if "title" in k:
            self.title = paramDict["title"]
        if "categroyId" in k:
            self.categoryId = paramDict["categoryId"]
        if "description" in k:
            self.description = paramDict["description"]
        if "recommendedPrice" in k:
            self.recommendedPrice = paramDict["recommendedPrice"]
        if "estimatedDurationMinutes" in k:
            self.estimatedDurationMinutes = paramDict["estimatedDuration"]
        if "locationALongitude" in k:
            self.locationALongitude = paramDict["locationALongitude"]
        if "locationALatitude" in k:
            self.locationALatitude = paramDict["locationALatitude"]
        if "locationBLongitude" in k:
            self.locationBLongitude = paramDict["locationBLongitude"]
        if "locationBLatitude" in k:
            self.locationBLatitude = paramDict["locationBLatitude"]
        db.session.commit()

    @classmethod
    def getRecommendTasks(cls):
        tasks = Task.query.filter_by(
            acceptedOfferId=None
        )
        tasks = [task.taskId for task in tasks]
        return tasks

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
        if task:
            if task.recommendedPrice is not None:
                task.recommendedPrice = float(task.recommendedPrice)
            if task.locationALatitude is not None:
                task.locationALatitude = float(task.locationALatitude)
            if task.locationBLatitude is not None:
                task.locationBLatitude = float(task.locationBLatitude)
            if task.locationALongitude is not None:
                task.locationALongitude = float(task.locationALongitude)
            if task.locationBLongitude is not None:
                task.locationBLongitude = float(task.locationBLongitude)

        return task

    '''
    Delete
    '''
    @classmethod
    def deleteByTaskId(cls, taskId):
        '''
        Deletes a task by ID

        Unsafe

        :param taskId:
        :return:
        '''
        task = cls.getByTaskId(taskId)
        if task:
            task.delete()
            db.session.commit()
            return True
        else:
            return False

    '''
    Create
    '''
    @classmethod
    def createTask(cls, posterUserId, categoryId, title,
                   description=None, recommendedPrice=None, estimatedDurationMinutes=None,
                   locationALongitude=None, locationALatitude=None, locationBLongitude=None,
                    locationBLatitude=None):

        '''
        Creates a Task

        '''
        # Create Task
        task = Task(
            posterUserId=posterUserId,
            categoryId=categoryId,
            title=title,
            description=description,
            recommendedPrice=recommendedPrice,
            estimatedDurationMinutes=estimatedDurationMinutes,
            locationALongitude=locationALongitude,
            locationALatitude=locationALatitude,
            locationBLongitude=locationBLongitude,
            locationBLatitude=locationBLatitude

        )

        # Save User to database
        db.session.add(task)
        db.session.commit()
        return task
