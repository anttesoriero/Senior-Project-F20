'''
Account Balance's model for database
Stores account balance of Users
OneToOne relationship with the User table

@author Matthew Schofield
@version 11.28.2020
'''
# Library imports

# Module imports
from app import db

class AccountBalance(db.Model):
    '''
    Column definitions

    user_id         Integer PK
    account_balance Numeric 7.2
    '''
    userId = db.Column(db.Integer(), db.ForeignKey("user.userId"),  primary_key=True)
    accountBalance = db.Column(db.Numeric(9,2))

    def getBalance(self):
        '''
        Return account balance

        :return: account balance of the user
        '''
        return float(self.accountBalance)

    def changeBalance(self, amountToChange):
        '''
        Adds or subtracts new balance

        :param: amountToChange - amount to add/subtract to a user's balance
        :return: boolean based on success
        '''
        # Check that the amount to change will not put balance in the negative
        if (float(self.accountBalance) + amountToChange) < 0:
            return False

        # Make change
        self.accountBalance = float(self.accountBalance) + amountToChange
        db.session.commit()
        return True

    @classmethod
    def createBalance(cls, user, accountBalance):
        '''
        Create an Account Balance

        :param user: User connected to
        :param accountBalance: initial balance
        '''
        # Balance cannot be negative
        if accountBalance < 0:
            return False

        # Create Credentials object
        accountBalance = AccountBalance(user=user, accountBalance=accountBalance)

        # Save to database
        db.session.add(accountBalance)
        db.session.commit()
        return True
