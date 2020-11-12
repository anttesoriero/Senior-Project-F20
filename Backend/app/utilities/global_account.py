
from app.models.user_model import User

commissionAccount = 0
arbitrationAccount = 0
commission = 0.02
deals = {}

def addDeal(taskId, userIdFrom, userIdTo, amount):
    global commissionAccount
    global arbitrationAccount
    global commission
    global deals
    # Check users exist
    userFrom = User.getByUserId(userIdFrom)
    userTo = User.getByUserId(userIdTo)
    if userFrom is None or userTo is None:
        return False

    # Check that the payment form the user is possible
    if userFrom.getAccountBalance() < amount:
        return False

    # Take money from user and add to deals list
    userFrom.changeAccountBalance(-amount)
    arbitrationAccount += amount
    deals[taskId] = {"From": userIdFrom, "To": userIdTo, "Amount": amount}

def completeDeal(taskId):
    global commissionAccount
    global arbitrationAccount
    global commission
    global deals
    deal = deals[taskId]
    amount = deal["Amount"]
    userTo = User.getByUserId(deal["To"])

    if userTo is None:
        return False

    commissionAmount = amount * commission
    paymentAmount = amount - commissionAmount
    arbitrationAccount -= amount
    commissionAccount += commissionAmount
    userTo.changeAccountBalance(paymentAmount)
