'''
User's model for database

@author Matthew Schofield, Steven Jiang
@version 11.11.2020
'''
# Module imports
from app import db

# Models imports
from app.models.credentials_model import Credentials
from app.models.account_balance_model import AccountBalance
from app.models.task_model import Task
from app.models.offer_model import Offer
from app.models.extended_user_model import ExtendedUser
from app.models.survey_model import Survey
from app.models.historical_survey_model import HistoricalSurvey
from app.models.category_model import Category

class User(db.Model):
    '''
    Column definitions

    userId         Integer  PK
    email          String   Unique
    firstName      String   Nullable
    lastName       String   Nullable
    preferredName  String   Nullable
    phoneNumber    String   Nullable
    activeAccount  Boolean  default=True
    profilePicture String   Nullable
    '''
    # Column definitions
    userId = db.Column(db.Integer(), primary_key=True)
    email = db.Column(db.String(120), index=True, unique=True)
    firstName = db.Column(db.String(120), nullable=False, default="")
    lastName = db.Column(db.String(120), nullable=True, default="")
    preferredName = db.Column(db.String(120), nullable=True)
    phoneNumber = db.Column(db.String(12), nullable=True)
    activeAccount = db.Column(db.Boolean(), default=True)
    profilePicture = db.Column(db.String(240), nullable=True)
    workerRating = db.Column(db.Integer(), nullable=True)
    posterRating = db.Column(db.Integer(), nullable=True)
    bio = db.Column(db.String(500), nullable=True)
    address = db.Column(db.String(100), nullable=True)

    # Set-up Database Relationships
    credentials = db.relationship('Credentials', backref="user", uselist=False, cascade="all, delete-orphan")
    accountBalance = db.relationship('AccountBalance', backref="user", uselist=False, cascade="all, delete-orphan")
    postedTasks = db.relationship('Task', backref="user", uselist=True, cascade="all, delete-orphan")
    extendedModel = db.relationship('ExtendedUser', backref="user", uselist=False, cascade="all, delete-orphan")
    historicalSurvey = db.relationship('HistoricalSurvey', backref="user", uselist=True, cascade="all, delete-orphan")


    '''
    General Setters and Getters
    '''
    def getMostInterested(self):
        catId = self.extendedModel.mostInterestedCategory
        if catId is not None:
            return Category.getByCategoryId(catId).getName()
        else:
            return None

    def getLeastInterested(self):
        catId = self.extendedModel.leastInterestedCategory
        if catId is not None:
            return Category.getByCategoryId(catId).getName()
        else:
            return None

    def setProfilePicture(self, newProfilePicture):
        self.profilePicture = newProfilePicture
        db.session.commit()

    def setFirstName(self, newName):
        self.firstName = newName
        db.session.commit()

    def setLastName(self, newName):
        self.lastName = newName
        db.session.commit()

    def setEmail(self, newEmail):
        self.email = newEmail
        db.session.commit()

    def setPreferredName(self, newPreferredName):
        self.preferredName = newPreferredName
        db.session.commit()

    def setPhoneNumber(self, newPhoneNumber):
        self.phoneNumber = newPhoneNumber
        db.session.commit()

    def setAddress(self, newAddress):
        self.address = newAddress
        db.session.commit()

    def setBio(self, newBio):
        self.bio = newBio
        db.session.commit()

    def getTaskIds(self):
        return [task.taskId for task in self.postedTasks]

    def getWorkerRating(self):
        return self.workerRating

    def getPosterRating(self):
        return self.posterRating

    '''
    Interactions with credentials are routed through Credentials object
    '''
    def setPassword(self, password):
        self.credentials.changePassword(password=password)

    def checkCredentials(self, password):
        '''
        Check if a plain text password matches the User's hashed password

        :param password: plain text password
        :return: Boolean whether password is the User's password
        '''
        return self.credentials.checkPassword(password)

    '''
    Interactions with account balance are routed through Account Balance object
    '''
    def getAccountBalance(self):
        return self.accountBalance.getBalance()

    def changeAccountBalance(self, amountToChange):
        return self.accountBalance.changeBalance(amountToChange)

    def getBriefPublicInfo(self):
        '''
        Get a brief overview of information about a user

        :return: dictionary of general User information
        '''
        name = self.firstName + ' ' + self.lastName
        output = {
            "id": self.userId,
            "name": name,
            "preferredName": self.preferredName,
            "phoneNumber": self.phoneNumber,
            "email": self.email,
            "profilePicture": self.profilePicture,
            "posterRating": self.posterRating,
            "workerRating": self.workerRating
        }
        return output

    def getPublicInfo(self):
        '''
        Get a more in-depth overview of information about a user

        :return: dictionary of more in-depth user information
        '''
        name = self.firstName + ' ' + self.lastName
        output = {
            "id": self.userId,
            "name": name,
            "bio": self.bio,
            "preferredName": self.preferredName,
            "phoneNumber": self.phoneNumber,
            "email": self.email,
            "gender": self.extendedModel.gender,
            "profilePicture": self.profilePicture,
            "posterRating": self.posterRating,
            "workerRating": self.workerRating,
            "leastInterestedCategory": self.getLeastInterested(),
            "mostInterestedCategory": self.getMostInterested()
        }
        return output

    def recommendSurvey(self):
        '''
        Recommend a Survey for a User

        :return: recommended survey Id
        '''
        # Get both lists to compare
        survey_ids = Survey.getSurveyIDs()
        completed_survey_ids = HistoricalSurvey.getHistoricalSurveyIdsForUserId(self.userId)
        availableSurveyIds = {}

        # Create a map for the count of the number of times a user has answered each survey
        for survey_id in survey_ids:
            availableSurveyIds[survey_id] = completed_survey_ids.count(survey_id)

        # Use the survey they have responded to the least
        recommendedSurvey = min(availableSurveyIds.keys(), key=(lambda k: availableSurveyIds[k]))

        return recommendedSurvey

    def updateWorkerRating(self):
        '''
        Update a User's worker rating
        '''
        # Get all worker ratings for tasks involved in
        tasksWorkerRatings = Task.buildWorkerRatingsForUser(self.userId)

        # find mean
        meanOfWorkerRatings = int(sum(tasksWorkerRatings)/len(tasksWorkerRatings))

        # set value
        self.workerRating = meanOfWorkerRatings
        db.session.commit()

    def updatePosterRating(self):
        '''
        Update a User's poster rating
        '''
        # Get all poster ratings for tasks involved in
        tasksPosterRatings = Task.buildPosterRatingsForUser(self.userId)

        # find mean
        meanOfPosterRatings = int(sum(tasksPosterRatings)/len(tasksPosterRatings))

        # set value
        self.posterRating = meanOfPosterRatings
        db.session.commit()

    @classmethod
    def getByEmail(cls, email):
        '''
        Get User by email

        :param email: email to get User with
        :return: User object connected to given email,
            or None
        '''
        # User or None
        user = User.query.filter_by(
            email=email
        ).first()
        return user

    @classmethod
    def getByUserId(cls, userId):
        '''
        Get User by user_id

        :param user_id: user_id to get User with
        :return: User object connected to given user_id
            or None
        '''
        user = User.query.filter_by(
            userId=userId
        ).first()

        return user

    @classmethod
    def existsByEmail(cls, email):
        '''
        Check if a given User exists by email

        :param email: email to check for User existance
        :return: Boolean whether User exists
        '''
        return not User.getByEmail(email)

    @classmethod
    def createUser(cls, email, password, firstName="", lastName="", preferredName="", phoneNumber="",
                   profilePicture="", bio="", address=""):
        '''
        Creates a User

        :param: user Information
        :return: User object
        '''
        # Check if user exists
        if not User.existsByEmail(email):
            return None

        # Create User
        user = User(email=email, firstName=firstName, lastName=lastName, preferredName=preferredName,
                    phoneNumber=phoneNumber, profilePicture=profilePicture, bio=bio, address=address)
        Credentials.createCredentials(password=password, user=user)
        AccountBalance.createBalance(user=user, accountBalance=100.0)
        ExtendedUser.createExtendedUserModel(user=user)

        # Save User to database
        db.session.add(user)
        db.session.commit()
        return user

    @classmethod
    def deleteUser(cls, userId):
        '''
        Delete User by user_id

        :param user_id: user_id to get User with
        :return: None
        '''
        user = User.query.filter_by(
            userId=userId
        ).first()

        db.session.delete(user)
        db.session.commit()

    @classmethod
    def getPostedTasks(cls, userId):
        '''
        Gets the Tasks for a particular user

        :param userId user_id to get user
        :return list of task ids for a user
        '''
        tasks = Task.query.filter_by(posterUserId = userId).all()
        tasks = [task for task in tasks if not task.completed]
        return [task.getPrivateInfo() for task in tasks]


    @classmethod
    def getOffers(cls, userId, historical):
        '''
        Gets the Offers for a particular user

        :param userId user_id to get user
        :return list of offers a user has made and associated tasks
        '''
        # All offers made by user
        offers = Offer.query.filter_by(userIdFrom=userId).all()

        # Get all tasks associated with the offers a user ahs made
        output = {}
        # Iterate through offers
        for offer in offers:
            # The offer is active
            if not offer.archived:
                # Get the task associated with the offer
                task = Task.getByTaskId(offer.taskId)
                # Check the task is not old or that you do want old tasks
                if not task.completed or historical:
                    # If the offer is not already in the map insert it and associated task
                    if not offer.taskId in output.keys():
                        output[offer.taskId] = {"task": task.getPublicInfo(), "myOffers": []}
                    # Attaches offer to related task
                    output[offer.taskId]["myOffers"].append(offer.getInfo())
        # Convert map to list
        newOutput = []
        for out in output.keys():
            newOutput.append(output[out])
        return newOutput

    @classmethod
    def getPastTasks(cls, userId):
        '''
        Get past tasks for a user posted

        :param userId: userId of User to get tasks for
        :return: Task and accepted Offer
        '''
        # Get Tasks posted by a user
        tasks = Task.query.filter_by(posterUserId=userId).filter_by(completed=True).all()

        # Prepare output
        output = []
        for task in tasks:
            # Get accepted offer
            offer = Offer.query.filter_by(taskId=task.taskId).filter_by(accepted=True).first()
            output.append({"task": task.getPrivateInfo(), "offer": offer.getInfo()})
        return output

    @classmethod
    def getPastCompletedTasks(cls, userId):
        '''
        Get past tasks completed by a user

        :param userId: userId of User to get tasks completed
        :return: Task and accepted Offer
        '''
        # Get Offers accepted from user
        offers = Offer.query.filter_by(userIdFrom=userId).filter_by(accepted=True).all()

        # Prepare output
        output = []
        for offer in offers:
            # Get Tasks completed
            task = Task.query.filter_by(taskId=offer.taskId).filter_by(completed=True).first()
            output.append({"task": task.getPrivateInfo(), "offer": offer.getInfo()})
        return output

    @classmethod
    def getAll(cls):
        '''
        Gets all User object from the User table

        :return list of User
        '''
        return [u.getPublicInfo() for u in User.query.all()]
