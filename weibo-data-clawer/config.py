# Mongo 数据库
MONGO_URL = 'localhost'
MONGO_DB = 'Weibo'
MONGO_TABLE_BLOGGER_INFO = 'blogger_info'
MONGO_TABLE_WEIBO_CONTENT = 'weibo_content'
MONGO_TABLE_USER_ID = 'user_id'
MONGO_TABLE_BLOGGER_FRIEND = 'blogger_friend'

# 每个博主爬取的微博上限
WEIBO_NUMBER_MAX = 50   # 50 条
WEIBO_DAYS_MAX = 90     # 3 个月

COOKIE = {"Cookie": "ALF=1547708441; SUB=_2A25xGKppDeRhGeVM7lcR9y_PyziIHXVS4jYhrDV6PUJbkdAKLXXgkW1NTLxziT"
                    "cRyMbhcu9QREH6osD5GwRBukFr; SUHB=0vJYZrqqyWEkoX; SCF=AsA34-dLr8-JsLCqXeR2_WUpwRiVdls9"
                    "tqe4SJR8hVgOjLF6q6MzjGeUuNRmZZ1qOx-S8KlRlIT7baCmJJ3CCrk.; _T_WM=c54bc06defef8599c61a0"
                    "37e1e7c969b; _WEIBO_UID=3255071304; MLOGIN=1; M_WEIBOCN_PARAMS=luicode%3D20000174"}

# 爬取 MONGO_TABLE_ID 表中用户序号在 [BEGIN_INDEX, _) 区间内的用户的微博所有数据
BEGIN_INDEX = 0
