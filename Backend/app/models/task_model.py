'''
Task's model for database

These are Tasks that Users post

@author Matthew Schofield
@version 11.11.2020
'''
# Module imports
from app import db


from app.models.offer_model import Offer

import datetime

class Task(db.Model):
    '''
    Column definitions

    taskId             Integer PK
    posterUserId       Integer Index
    categoryId         Integer
    description        String
    title              String
    startDate          DateTime
    recommendedPrice   Decimal(4,2) nullable
    acceptedOfferID    Integer nullable
    postedStartDate
    estimatedDuration  Integer nullable
    estimatedDuration  Integer nullable
    locationALongitude
    locationALatitude
    '''
    # Column definitions
    taskId = db.Column(db.Integer(), primary_key=True)
    posterUserId = db.Column(db.Integer(), db.ForeignKey("user.userId"), index=True)
    categoryId = db.Column(db.Integer(), db.ForeignKey("category.categoryId"))
    description = db.Column(db.String(300), nullable=True)
    title = db.Column(db.String(60), nullable=True)
    startDate = db.Column(db.DateTime())
    recommendedPrice = db.Column(db.Numeric(6,2), nullable=True)
    estimatedDurationMinutes = db.Column(db.Integer(), nullable=True)
    workerRating = db.Column(db.Integer(), nullable=True)
    posterRating = db.Column(db.Integer(), nullable = True)
    locationALongitude = db.Column(db.Numeric(8,5), nullable=True)
    locationALatitude = db.Column(db.Numeric(8,5), nullable=True)
    completed = db.Column(db.Boolean(), nullable=False)


    # Set-up Database Relationships
    acceptedOfferId = db.relationship('Offer', backref="offer", uselist=True)

    '''
    Read
    '''
    def isAccepted(self):
        return True in [offer.accepted for offer in self.acceptedOfferId]

    def setWorkerRating(self, newWorkerRating):
        self.workerRating = newWorkerRating
        db.session.commit()

    def setCompleted(self):
        self.completed = True
        db.session.commit()

    def setPosterRating(self, newPosterRating):
        self.posterRating = newPosterRating
        db.session.commit()

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
            "accepted": self.isAccepted(),
            "startDate": self.startDate,
            "completed": self.completed
        }
        return output

    def getPublicInfo(self):
        '''
        Retrieves the public information about a task

        :return: dictionary of information about a task
        '''
        # Strip latitude and longitudes to only 2 decimals
        locationALongitude = str("%.2f" % self.locationALongitude) if self.locationALongitude else None
        locationALatitude = str("%.2f" % self.locationALatitude) if self.locationALatitude else None


        recommendedPrice = str("%.2f" % self.recommendedPrice) if self.recommendedPrice else None

        output = {
            "taskId": self.taskId,
            "posterTaskId": self.posterUserId,
            "description": self.description,
            "title": self.title,
            "startDate": self.startDate,
            "categoryId": self.categoryId,
            "recommendedPrice": recommendedPrice,
            "accepted": self.isAccepted(),
            "estimatedDurationMinutes": self.estimatedDurationMinutes,
            "locationALongitude": locationALongitude,
            "locationALatitude": locationALatitude,
            "completed": self.completed
        }
        return output

    def getBriefPrivateInfo(self):
        '''
        Package brief private information about a Task

        :return: Brief private information about a Task
        '''
        recommendedPrice = str("%.2f" % self.recommendedPrice) if self.recommendedPrice else None
        output = {
            "taskId": self.taskId,
            "title": self.title,
            "categoryId": self.categoryId,

            "startDate": self.startDate,
            "recommendedPrice": recommendedPrice,
            "accepted": self.isAccepted(),
            "completed": self.completed
        }
        return output

    def getPrivateInfo(self):
        '''
        Package private information about a Task

        :return: Private information about a Task
        '''
        # Strip latitude and longitudes to only 2 decimals
        locationALongitude = str("%.4f" % self.locationALongitude) if self.locationALongitude else None
        locationALatitude = str("%.4f" % self.locationALatitude) if self.locationALatitude else None
        recommendedPrice = str("%.2f" % self.recommendedPrice) if self.recommendedPrice else None

        worker = self.getWorker()

        output = {
            "taskId": self.taskId,
            "posterTaskId": self.posterUserId,
            "description": self.description,
            "title": self.title,
            "startDate": self.startDate,
            "categoryId": self.categoryId,
            "recommendedPrice": recommendedPrice,
            "accepted": self.isAccepted(),
            "estimatedDurationMinutes": self.estimatedDurationMinutes,
            "locationALongitude": locationALongitude,
            "locationALatitude": locationALatitude,
            "completed": self.completed,
            "worker": worker
        }
        return output

    '''
    Update
    '''
    def edit(self, paramDict):
        '''
        Edit information about a task

        :param paramDict: task information to change
        '''
        k = paramDict.keys()
        if "title" in k:
            self.title = paramDict["title"]
        if "categoryId" in k:
            self.categoryId = paramDict["categoryId"]
        if "description" in k:
            self.description = paramDict["description"]
        if "recommendedPrice" in k:
            self.recommendedPrice = paramDict["recommendedPrice"]
        if "estimatedDurationMinutes" in k:
            self.estimatedDurationMinutes = paramDict["estimatedDurationMinutes"]
        if "startDate" in k:
            self.startDate = datetime.datetime.strptime(paramDict["startDate"], "%Y-%m-%d %H:%M")
        db.session.commit()

    def getWorker(self):
        '''
        Gets the worker for a task by checking its accepted offer

        :return: User id of the worker or None
        '''
        offers = Offer.getOffersForTask(self.taskId)
        worker = None
        for offer in offers:
            if offer.accepted:
                worker = offer.userIdFrom
        return worker


    @classmethod
    def buildPosterRatingsForUser(cls, userId):
        '''
        Get all poster ratings for a user by userId

        :param userId: User id to get poster ratings for
        :return: list of poster ratings
        '''
        # Get all tasks a user posted that have a poster rating
        tasks = Task.query.filter(
            cls.posterUserId == userId,
            cls.posterRating != None
        ).all()

        # Return a list of all poster ratings for the user
        return [task.posterRating for task in tasks]

    @classmethod
    def buildWorkerRatingsForUser(cls, userId):
        '''
        Get all worker ratings for a User by userId

        :param userId: User's userId
        :return: list of worker ratings for the given user
        '''
        # Get all tasks
        tasks = Task.getAll()

        # Get offers
        offerSets = [Offer.getOffersForTask(task["taskId"]) for task in tasks]

        # Get all task Ids that a user has been a worker for
        usersTasks = []
        for offerSet in offerSets:
            for offer in offerSet:
                if int(offer.userIdFrom) == int(userId) and offer.accepted:
                    usersTasks.append(offer.taskId)

        # Get all worker ratings for a user
        workerRatings = []
        for task in [Task.getByTaskId(taskId) for taskId in usersTasks]:
            if task.workerRating is not None:
                workerRatings.append(task.workerRating)

        return workerRatings

    @classmethod
    def search(cls, queryP, max=100, userId=None):
        '''
        Search

        All optional
        {
            "title":{
                "contains": str,
                "startsWith": str,
                "endsWith": str,
                "matches": str
            },
            "categoryId":
            {
                "==": int,
                "!=": int
            },
            "recommendedPrice":
            {
                "<=": float,
                ">=":float
            }
            "location":
            {
                "within': [Lower Lat, Upper Lat, Lower Long, Upper Long]

            }
        }

        :return: list of Tasks
        '''
        # Initialize filters, do not show own tasks or completed tasks
        filters = []
        filters.append(cls.posterUserId != userId)
        filters.append(cls.completed == False)

        # Parse title search term
        if "title" in queryP.keys():
            if "contains" in queryP["title"].keys():
                q = queryP["title"]["contains"].replace("+", " ")
                filters.append(cls.title.like("%" + q + "%"))
            if "startsWith" in queryP["title"].keys():
                filters.append(cls.title.like(queryP["title"]["startsWith"] + "%"))
            if "endsWith" in queryP["title"].keys():
                filters.append(cls.title.like("%" + queryP["title"]["endsWith"]))
            if "matches" in queryP["title"].keys():
                filters.append(cls.title.like(queryP["title"]["matches"]))

        # Parse cat Id search term
        if "categoryId" in queryP.keys():
            if "==" in queryP["categoryId"].keys() and queryP["categoryId"]["=="] != 0:
                filters.append(cls.categoryId == queryP["categoryId"]["=="])
            if "!=" in queryP["categoryId"].keys():
                filters.append(cls.categoryId != queryP["categoryId"]["!="])

        # Parse recommended price search term
        if "recommendedPrice" in queryP.keys():
            if ">=" in queryP["recommendedPrice"].keys():
                filters.append(cls.recommendedPrice >= queryP["recommendedPrice"][">="])
            if "<=" in queryP["recommendedPrice"].keys():
                filters.append(cls.recommendedPrice <= queryP["recommendedPrice"]["<="])

        # Parse location search term
        if "location" in queryP.keys():
            if "within" in queryP["location"].keys():
                if len(queryP["location"]["within"]) == 4:
                    filters.append(cls.locationALatitude >= float(queryP["location"]["within"][0]))
                    filters.append(cls.locationALatitude <= float(queryP["location"]["within"][1]))
                    filters.append(cls.locationALongitude >= float(queryP["location"]["within"][2]))
                    filters.append(cls.locationALongitude <= float(queryP["location"]["within"][3]))

        # Execute query for Tasks
        tasks = Task.query.filter(*filters).limit(max)
        return [task for task in tasks if not task.isAccepted()]


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
            if task.locationALongitude is not None:
                task.locationALongitude = float(task.locationALongitude)

        return task

    '''
    Delete
    '''
    @classmethod
    def deleteByTaskId(cls, taskId):
        '''
        Deletes a task by ID

        :param taskId: taskId to delete
        :return: boolean whether task was found to then be deleted
        '''
        # Get task
        task = cls.getByTaskId(taskId)

        # If task exists
        if task:
            # Delete all attached offers
            Offer.deleteAllByTaskId(taskId)
            # Delete Task
            db.session.query(Task).filter_by(taskId=taskId).delete()
            # Commit
            db.session.commit()
            return True
        else:
            return False

    '''
    Create
    '''
    @classmethod
    def createTask(cls, user, categoryId, title,
                   description=None, recommendedPrice=None, estimatedDurationMinutes=None,
                   locationALongitude=None, locationALatitude=None, startDate=None):
        '''
        Creates a Task

        :return: Task object
        '''
        # Convert startDate to correct format
        if startDate is not None:
            try:
               startDate = datetime.datetime.strptime(startDate, "%Y-%m-%d %H:%M")
            except:
                startDate = str(startDate)

        # Create Task
        task = Task(
            posterUserId=user.userId,
            categoryId=categoryId,
            title=title,
            startDate=startDate,
            description=description,
            recommendedPrice=recommendedPrice,
            estimatedDurationMinutes=estimatedDurationMinutes,
            locationALongitude=locationALongitude,
            locationALatitude=locationALatitude,
            completed=False
        )

        # If a location is set update the user's extended model
        if not locationALongitude is None and not locationALatitude is None:
            user.extendedModel.setLocationInterestedInALongitude(locationALongitude)
            user.extendedModel.setLocationInterestedInALatitude(locationALatitude)

        # Save User to database
        db.session.add(task)
        db.session.commit()
        return task

    @classmethod
    def getAll(cls):
        '''
        Gets the task ids from the Task table

        :return list of task ids
        '''
        return [task.getPublicInfo() for task in Task.query.all()]
