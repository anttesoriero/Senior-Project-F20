'''
Task's model for database

These are Tasks that Users post

@author Matthew Schofield
@version 11.11.2020
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
    recommendedPrice   Decimal(4,2) nullable
    acceptedOfferID    Integer nullable
    postedStartDate
    estimatedDuration  Integer nullable
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
    recommendedPrice = db.Column(db.Numeric(6,2), nullable=True)
    estimatedDurationMinutes = db.Column(db.Integer(), nullable=True)
    locationALongitude = db.Column(db.Numeric(8,5), nullable=True)
    locationALatitude = db.Column(db.Numeric(8,5), nullable=True)
    locationBLongitude = db.Column(db.Numeric(8,5), nullable=True)
    locationBLatitude = db.Column(db.Numeric(8,5), nullable=True)

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
        locationALatitude = str("%.1f" % self.locationALatitude) if self.locationALatitude else None
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
            "recommendedPrice": recommendedPrice,
            "accepted": self.isAccepted()
        }
        return output

    def getPrivateInfo(self):
        '''
        Package private information about a Task

        :return: Private information about a Task
        '''
        # Strip latitude and longitudes to only 2 decimals
        locationALongitude = str("%.1f" % self.locationALongitude) if self.locationALongitude else None
        locationALatitude = str("%.1f" % self.locationALatitude) if self.locationALatitude else None
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
    def acceptOffer(self, offer):
        self.acceptedOfferId = offer
        db.session.commit()

    def edit(self, paramDict):
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
            self.estimatedDurationMinutes = paramDict["estimatedDurationMinutes"]
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
    def search(cls, queryP, max=100):
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
                "==": int
            },
            "recommendedPrice":
            {
                "<=": float,
                ">=":float
            }
            "location":
            {
                "within':
                {
                    [Lower Lat, Upper Lat, Lower Long, Upper Long]
                }
            }
        }

        :param queryP:
        :param max:
        :return:
        '''
        filters = []

        if "title" in queryP.keys():
            if "contains" in queryP["title"].keys():
                filters.append(cls.title.like("%" + queryP["title"]["contains"] + "%"))
            if "startsWith" in queryP["title"].keys():
                filters.append(cls.title.like(queryP["title"]["startsWith"] + "%"))
            if "endsWith" in queryP["title"].keys():
                filters.append(cls.title.like("%" + queryP["title"]["startsWith"]))
            if "matches" in queryP["title"].keys():
                filters.append(cls.title.like(queryP["title"]["startsWith"]))

        if "categoryId" in queryP.keys():
            if "==" in queryP["categoryId"].keys():
                filters.append(cls.categoryId == queryP["categoryId"]["=="])

        if "recommendedPrice" in queryP.keys():
            if ">=" in queryP["recommendedPrice"].keys():
                filters.append(cls.recommendedPrice >= queryP["recommendedPrice"][">="])
            if "<=" in queryP["recommendedPrice"].keys():
                filters.append(cls.recommendedPrice <= queryP["recommendedPrice"]["<="])

        if "location" in queryP.keys():
            if "within" in queryP["location"].keys():
                if len(queryP["location"]["within"]) == 4:
                    filters.append(cls.locationALatitude >= queryP["location"]["within"][0])
                    filters.append(cls.locationALatitude <= queryP["location"]["within"][1])
                    filters.append(cls.locationALongitude >= queryP["location"]["within"][2])
                    filters.append(cls.locationALongitude <= queryP["location"]["within"][3])


        tasks = [task.taskId for task in Task.query.filter(*filters).limit(max)]
        return tasks

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
            db.session.delete(task)
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

        :param posterUserId:
        :param categoryId:
        :param title:
        :param description:
        :param recommendedPrice:
        :param estimatedDurationMinutes:
        :param locationALongitude:
        :param locationALatitude:
        :param locationBLongitude:
        :param locationBLatitude:
        :return: Task created
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

    @classmethod
    def getAll(cls):
        '''
        Gets the task ids from the Task table

        :return list of task ids
        '''
        return [task.getPublicInfo() for task in Task.query.all()]
