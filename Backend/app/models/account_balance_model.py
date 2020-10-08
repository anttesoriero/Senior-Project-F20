'''
Account balance for users

@author Steven Jiang
@version 10.08.2020
'''
# Module imports
from app import db

class AccountBalance(db.Model):
    '''
    Column definitions
    user_id
    account_balance
    '''
    userId = db.Column(db.Integer(), db.ForeignKey("user.userId"),  primary_key=True)
    accountBalance = db.Column(db.Integer())

    