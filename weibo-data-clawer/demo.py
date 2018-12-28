import pymongo


MONGO_URL = '10.82.82.15'
MONGO_DB = 'Weibo'
MONGO_TABLE_BLOGGER = 'blogger_info'


client = pymongo.MongoClient(MONGO_URL, connect=False)
db = client[MONGO_DB]


if __name__ == '__main__':
    db[MONGO_TABLE_BLOGGER].insert_one({
        'name': 'shaodilong'
    })
