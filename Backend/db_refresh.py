import MySQLdb

db = MySQLdb.connect(host="127.0.0.1",    # your host, usually localhost
                     user="oddjobsuser",         # your username
                     passwd="asdllM$o2pecfsEEA",  # your password
                     )


mycursor = db.cursor()

sql = "DROP DATABASE oddjobs"
mycursor.execute(sql)
sql = "CREATE DATABASE oddjobs"
mycursor.execute(sql)

