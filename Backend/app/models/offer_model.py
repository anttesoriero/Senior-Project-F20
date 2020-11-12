'''
Offer's model for database

These are offers a User makes for being hired to complete a Task

@author Matthew Schofield
@version 11.11.2020
'''
# Module imports
from app import db

# Library imports
import datetime

class Offer(db.Model):
    '''
    Column definitions
    offerId            | Integer  | PK
    taskId             | Integer
    userIdFrom         | Integer
    payment            | Numeric
    startDate          | DateTime | Nullable
    jobDurationMinutes | Integer  | Integer
    note               | Text     | Nullable
    accepted           | Boolean
    archived           | Boolean
    responseMessage    | Text     | Nullable
    '''
    # Column definitions
    offerId = db.Column(db.Integer(), primary_key=True)
    taskId = db.Column(db.Integer(), db.ForeignKey("task.taskId"), index=True)
    userIdFrom = db.Column(db.Integer(), db.ForeignKey("user.userId"), index=True)
    payment = db.Column(db.Numeric(6,2))
    startDate = db.Column(db.DateTime(), nullable=True)
    jobDurationMinutes = db.Column(db.Integer(), nullable=True)
    note = db.Column(db.Text(240), nullable=True)
    accepted = db.Column(db.Boolean())
    archived = db.Column(db.Boolean())
    responseMessage = db.Column(db.Text(240), nullable=True)

    def getInfo(self):
        '''
        Get information about Offer

        :return: Dictionary of information
        '''
        output = {
            "offerId": self.offerId,
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
        '''
        Set this Offer as accepted

        :param responseMessage: attached response message for an accepted offer
        '''
        # Archive other Offers
        self.archiveOffersForATask(self.taskId)

        # Set necessary fields and save
        self.archived = False
        self.accepted = True
        self.responseMessage = responseMessage
        db.session.commit()

    def reject(self, responseMessage):
        '''
        Set this Offer as rejected

        :param responseMessage: attached response message for the rejected offer
        '''
        # Archive only this Offer
        self.archived = True
        self.accepted = False
        self.responseMessage = responseMessage
        db.session.commit()

    '''
    Class methods
    '''
    @classmethod
    def createOffer(cls, taskId, userIdFrom, payment, startDate=None, jobDurationMinutes=None, note=None):
        '''
        Creates an Offer

        :param taskId: Task connected to
        :param userIdFrom: User from
        :param payment: payment offered
        :param startDate: datetime to do Task
        :param jobDurationMinutes: Expected minutes to do task
        :param note: Attached note
        '''
        # Convert startDate to correct format
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
        '''
        Get offer by offerId

        :param offerId: offerId to find
        :return: Offer found or None
        '''
        return Offer.query.filter_by(offerId=offerId).first()

    @classmethod
    def getOffersForTask(cls, taskId, includeArchived=False):
        '''
        Find offers for a Task

        :param taskId: taskId to find Task that Offers are for
        :param includeArchived: boolean whether to include archived Offers
        :return: List of Offers for a Task supplied by taskId
        '''
        if not includeArchived:
            # Get non-Archived Offers for a Task
            return Offer.query.filter_by(taskId=taskId, archived=False).all()
        else:
            # Get all Offers for a Task
            return Offer.query.filter_by(taskId=taskId).all()

    @classmethod
    def archiveOffersForATask(cls, taskId):
        '''
        Archive all Offers for a Task, found by taskId

        :param taskId: id to find Task by
        '''
        # Find all not archived Offers for a Task, and set them to archived
        for offer in Offer.query.filter_by(taskId=taskId, archived=False).all():
            offer.archived = True
        db.session.commit()

    @classmethod
    def getAll(cls):
        '''
        Gets the offer ids from the User table

        :return list of offer ids
        '''
        return [offer.getInfo() for offer in Offer.query.all()]
        
    @classmethod
    def deleteOffer(cls, offer):
        '''
        Delete an archived offer

        :param offer: Offer to delete
        :return: Boolean whether delete was successful
        '''
        if offer.archived:
            db.session.delete(offer)
            db.session.commit()
            return True
        return False
