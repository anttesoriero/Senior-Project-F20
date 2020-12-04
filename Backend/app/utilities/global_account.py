
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
    if userTo.getAccountBalance() < amount:
        return False

    # Take money from user and add to deals list
    userTo.changeAccountBalance(-amount)
    arbitrationAccount += amount
    deals[taskId] = {"From": userIdFrom, "To": userIdTo, "Amount": amount}
    return True

def completeDeal(taskId):
    global commissionAccount
    global arbitrationAccount
    global commission
    global deals
    deal = deals[taskId]
    amount = float(deal["Amount"])
    userFrom = User.getByUserId(deal["From"])

    if userFrom is None:
        return False

    commissionAmount = amount * commission
    paymentAmount = amount - commissionAmount
    arbitrationAccount -= amount
    commissionAccount += commissionAmount
    userFrom.changeAccountBalance(paymentAmount)
    return userFrom, True
