
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

        eum = user.extendedModel

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

        if eum.leastInterestedCategory is not None:
            filters["categoryId"] = {}
            filters["categoryId"]["!="] = eum.leastInterestedCategory

        tasks = [task.getPublicInfo() for task in Task.search(filters, 100, user.userId)]
        if len(tasks) == 0:
            return {"query": {}, "tasks": [task.getPublicInfo() for task in Task.search({}, 10, user.userId)]}
        elif len(tasks) > 10:
            most = eum.mostInterestedCategory
            mostAndRelated = [most]
            if most is not None:
                newTasks = []
                for task in tasks:
                    if task["categoryId"] in mostAndRelated:
                        newTasks.append(task)
                if len(newTasks) > 0:
                    tasks = newTasks
            return {"query": filters, "tasks": tasks}
        else:
            return {"query": filters, "tasks": tasks}

task_recommender = TaskRecommender()