'''
Recommends tasks to a user

:author: Matthew Schofield
:version: 12.14.2020
'''
from app.models.task_model import Task

class TaskRecommender:

     def __init__(self):
         pass

     def recommend(self, user):
        '''
        Recommend Task filters for a User

        :return: recommended task filters
        '''
        # Init filters
        filters = {}

        filters["location"] = {"within": []}

        # Get extended user model
        eum = user.extendedModel

        # If the user has a prioritized location use that
        if not eum.locationInterestedInALatitude is None and not eum.locationInterestedInALongitude is None:
            latA = float(eum.locationInterestedInALongitude)
            lonA = float(eum.locationInterestedInALatitude)
            if latA is not None and lonA is not None:
                filters["location"]["within"] = [
                        lonA-1,
                        lonA+1,
                        latA-1,
                        latA+1
                    ]
        # If the user has a least interested category block that
        if eum.leastInterestedCategory is not None:
            filters["categoryId"] = {}
            filters["categoryId"]["!="] = eum.leastInterestedCategory

        # Search tasks
        tasks = [task.getPublicInfo() for task in Task.search(filters, 100, user.userId)]

        # If there were no tasks, broaden the search
        if len(tasks) == 0:
            return {"query": {}, "tasks": [task.getPublicInfo() for task in Task.search({}, 10, user.userId)]}
        # If a large number of tasks are returned refine further
        elif len(tasks) > 10:
            # Get most interested category id
            most = eum.mostInterestedCategory

            # The most interested category and its related categories
            mostAndRelated = [most]

            # If the user has a most interested category use that
            if most is not None:
                newTasks = []
                for task in tasks:
                    if task["categoryId"] in mostAndRelated:
                        newTasks.append(task)
                # If there are still tasks use those, otherwise do not
                if len(newTasks) > 0:
                    tasks = newTasks
            return {"query": filters, "tasks": tasks}
        # if [1,10) tasks are retrieved return those
        else:
            return {"query": filters, "tasks": tasks}

# Init object
task_recommender = TaskRecommender()