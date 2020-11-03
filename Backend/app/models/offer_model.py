'''
Offer's model for database

These are offers a User makes for being hired to complete a Task

@author Matthew Schofield
@version 9.25.2020
'''
# Module imports
from app import db

# Library imports
import datetime

class Offer(db.Model):
    '''
    Column definitions
    offerId
    taskId
    userIdFrom
    payment
    startDate
    jobDurationMinutes
    note
    accepted
    responseMessage

    Relationships
    Task.taskId
    User.userId
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
    archived = db.Column(db.Boolean())
    responseMessage = db.Column(db.Text(240), nullable=True)

    def getInfo(self):
        output = {
            "taskId": self.taskId,
            "userIdFrom": self.userIdFrom,
            "payment": self.payment,
            "startDate": self.startDate,
            "jobDurationMinutes": self.jobDurationMinutes,
            "note": self.note,
            "accepted": self.accepted,
            "archived": self.archived,
            "responseMessage": self.responseMessage
        }
        return output

    def accept(self, responseMessage):
        self.archiveOffersForATask(self.taskId)
        self.archived = False
        self.accepted = True
        self.responseMessage = responseMessage
        db.session.commit()

    def reject(self, responseMessage):
        self.archived = True
        self.accepted = False
        self.responseMessage = responseMessage
        db.session.commit()

    '''
    Class method
    '''
    @classmethod
    def createOffer(cls, taskId, userIdFrom, payment, startDate, jobDurationMinutes=None, note=None):
        '''
        Creates an Offer

        '''
        if startDate is not None:
            startDate = datetime.datetime.strptime(startDate, "%Y-%m-%d %H:%M")
        # Create Offer

        offer = Offer(
            taskId=taskId,
            userIdFrom=userIdFrom,
            payment=payment,
            startDate=startDate,
            jobDurationMinutes=jobDurationMinutes,
            note=note,
            archived=False,
            accepted=False
        )

        # Save Offer to database
        db.session.add(offer)
        db.session.commit()
        return offer

    @classmethod
    def getOffer(cls, offerId):
        return Offer.query.filter_by(offerId=offerId).first()

    @classmethod
    def getOffersForTask(cls, taskId, includeArchived=False):
        if not includeArchived:
            return [offer.offerId for offer in Offer.query.filter_by(taskId=taskId, archived=False).all()]
        else:
            return [offer.offerId for offer in Offer.query.filter_by(taskId=taskId).all()]

    @classmethod
    def archiveOffersForATask(cls, taskId):
        for offer in Offer.query.filter_by(taskId=taskId, archived=False).all():
            offer.archived = True
        db.session.commit()

    @classmethod
    def getOfferIDs(cls):
        '''
        Gets the offer ids from the User table
        :return list of offer ids
        '''

        offers = db.session.query(Offer)
        offer_ids = []

        for offer in offers:
            # add offer ids to list
            offer_ids.append(offer.offerId)

        return offer_ids
        
    @classmethod
    def deleteOffer(cls, offer):
        db.session.delete(offer)
        db.session.commit()
