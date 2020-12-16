'''
Stores specific information for informing the service more
deeply about the User

:author: Matthew Schofield, Jasdip Dhillon
:version: 12.9.2020
'''
# Module imports
from app import db

class ExtendedUser(db.Model):
    '''
    Extended User Model = EUM

    Stores META data about users to be used in customizations and analysis

    Column definitions
    userId                          | Integer | PK
    gender                          | String  | Nullable
    age                             | Integer | Nullable
    simplicitySatisfaction          | Integer | Nullable
    visualSatisfaction              | Integer | Nullable
    overallSatisfaction             | Integer | Nullable
    reliabilitySatisfaction         | Integer | Nullable
    trustSatisfaction               | Integer | Nullable
    locationInterestedInALongitude  | Numeric | Nullable
    locationInterestedInALatitude   | Numeric | Nullable
    tasksPosted                     | Integer
    tasksAccepted                   | Integer
    posterPreference                | Integer | Nullable
    pricePerDrivingMinute           | Numeric | Nullable
    discoveryMethod                 | String  | Nullable
    mostInterestedCategory          | Integer | Nullable
    leastInterestedCategory         | Integer | Nullable
    '''
    # Column definitions
    userId = db.Column(db.Integer(), db.ForeignKey("user.userId"), primary_key=True)
    gender = db.Column(db.String(10), nullable=True)
    age = db.Column(db.String(10), nullable=True)
    simplicitySatisfaction = db.Column(db.Integer(), nullable=True)
    visualSatisfaction = db.Column(db.Integer(), nullable=True)
    overallSatisfaction = db.Column(db.Integer(), nullable=True)
    reliabilitySatisfaction = db.Column(db.Integer(), nullable=True)
    trustSatisfaction = db.Column(db.Integer(), nullable=True)
    locationInterestedInALongitude = db.Column(db.Numeric(9, 6), nullable=True)
    locationInterestedInALatitude = db.Column(db.Numeric(9, 6), nullable=True)
    tasksPosted = db.Column(db.Integer())
    tasksAccepted = db.Column(db.Integer())
    pricePerDrivingMinute = db.Column(db.Numeric(10, 2), nullable=True)
    discoveryMethod = db.Column(db.String(40), nullable=True)
    mostInterestedCategory = db.Column(db.Integer(), nullable=True)
    leastInterestedCategory = db.Column(db.Integer(), nullable=True)

    # User's reported preference
    posterPreference = db.Column(db.Integer(), nullable=True)

    def setGender(self, newGender):
        self.gender = newGender
        db.session.commit()

    def setAge(self, newAge):
        self.age = newAge
        db.session.commit()

    def setSimplicitySatisfaction(self, newSimplicitySat):
        self.simplicitySatisfaction = newSimplicitySat
        db.session.commit()

    def setVisualSatisfaction(self, newVisualSat):
        self.visualSatisfaction = newVisualSat
        db.session.commit()

    def setOverallSatisfaction(self, newOverallSat):
        self.overallSatisfaction = newOverallSat
        db.session.commit()

    def setTrustSatisfaction(self, newTrustSat):
        self.trustSatisfaction = newTrustSat
        db.session.commit()

    def setReliabilitySatisfaction(self, newReliabilitySat):
        self.reliabilitySatisfaction = newReliabilitySat
        db.session.commit()

    def setLocationInterestedInALongitude(self, newLongitudeA):
        self.locationInterestedInALongitude = newLongitudeA
        db.session.commit()

    def setLocationInterestedInALatitude(self, newLatitudeA):
        self.locationInterestedInALatitude = newLatitudeA
        db.session.commit()

    def setDiscovered(self, newDiscoveryMethod):
        self.discoveryMethod = newDiscoveryMethod
        db.session.commit()

    def incTasksPosted(self):
        self.tasksPosted += 1
        db.session.commit()

    def setTasksAccepted(self, newTasksAccepted):
        self.tasksAccepted = newTasksAccepted
        db.session.commit()

    def setPricePerDrivingMinute(self, newPricePerDrivingMinute):
        self.pricePerDrivingMinute = newPricePerDrivingMinute
        db.session.commit()

    def setPosterPreference(self, newPosterPreference):
        self.posterPreference = newPosterPreference
        db.session.commit()

    def setMostInterestedCategory(self, newMostInterestedCategory):
        self.mostInterestedCategory = newMostInterestedCategory
        db.session.commit()

    def setLeastInterestedCategory(self, newLeastInterestedCategory):
        self.leastInterestedCategory = newLeastInterestedCategory
        db.session.commit()



    @classmethod
    def createExtendedUserModel(cls, user):
        '''
        Create an Extended User Model object in the database

        :param user: User connected to
        '''
        # Create Credentials object
        extendedUser = ExtendedUser(user=user,
                                    tasksPosted=0,
                                    tasksAccepted=0
        )

        # Save to database
        db.session.add(extendedUser)
        db.session.commit()