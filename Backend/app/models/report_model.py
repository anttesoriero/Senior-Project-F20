'''
Report model for database

Lets a user report another user given the type of report 
and an optional description

@author Nicholas Romeo
@version 11.06.2020
'''
# Library imports
from werkzeug.security import generate_password_hash, check_password_hash

# Module imports
from app import db

class Report(db.Model):
    '''
    Column definitions

    reportId        Integer     PK
    userId_1        Integer     FK
    userId_2        Integer     nullable
    reportType      String      nullable
    description     text        nullable
    '''
    reportId = db.Column(db.Integer(), primary_key=True)
    # User sending report
    userId_1 = db.Column(db.Integer(), db.ForeignKey("user.userId"))
    # User being reported
    userId_2 = db.Column(db.Integer(), nullable=False)
    reportType = db.Column(db.String(120), nullable=False, default="")
    description = db.Column(db.Text(), nullable=True, default="")

    def getInfo(self):
        '''
        Get information about Report

        :return: see below
        '''
        return {
            "reportId": self.reportId,
            "userId_1": self.userId_1,
            "userId_2": self.userId_2,
            "reportType": self.reportType,
            "description": self.description
        }
    
    @classmethod
    def createReport(cls, userId_1, userId_2, reportType="", description=""):
        '''
        Creates a report

        :param userId_1: User sending report
        :param userId_2: User being reported
        '''

        # Create Report
        report = Report(
            userId_1=userId_1,
            userId_2=userId_2,
            reportType=reportType,
            description=description
        )

        # Save Report to database
        db.session.add(report)
        db.session.commit()

        return report

    @classmethod
    def getAll(cls):
        '''
        Gets the report ids from the User table

        :return list of report ids
        '''
        return [report.getInfo() for report in Report.query.all()]