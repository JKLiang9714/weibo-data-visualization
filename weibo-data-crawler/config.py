# Mongo 数据库
MONGO_URL = 'localhost'
MONGO_DB = 'NewWeibo'
MONGO_TABLE_BLOGGER_INFO = 'blogger_info'
MONGO_TABLE_WEIBO_CONTENT = 'weibo_content'
MONGO_TABLE_USER_ID = 'user_id'
MONGO_TABLE_BLOGGER_FRIEND = 'blogger_friend'

# 每个博主爬取的微博上限
WEIBO_NUMBER_MAX = 300  # 300 条
WEIBO_DAYS_MAX = 365    # 12 个月

# 每个博主爬取的好友上限
FRIEND_PAGE_MAX = 2     # 2页，每页10位，即20位

COOKIE = {"Cookie": "_T_WM=c54bc06defef8599c61a037e1e7c969b; _WEIBO_UID=3255071304; ALF=1549371692; SCF=AsA34-dLr8-JsLC"
                    "qXeR2_WUpwRiVdls9tqe4SJR8hVgO6jQqzozOXd_T_iojLoBbpqhZl7Ae8BNIfrD4fle4RbA.; SUB=_2A25xNnL1DeRhGeVM7"
                    "lcR9y_PyziIHXVS2R69rDV6PUJbktAKLUf4kW1NTLxziRML84j9Nk5DsgAne_VUV6dQXB1A; SUBP=0033WrSXqPxfM725Ws9j"
                    "qgMF55529P9D9WWDA86aTJOh1OS64xPHe_X05JpX5K-hUgL.FoeESK-7S020ehB2dJLoIX8kPEH8SE-4BE-RBbH8SFHF1F-RxF"
                    "H81FHWSE-ReCH8SEHFxFHWBCH8SE-4BC-RSFH8SC-4BbHFxFH8SCHFBCHWSntt; SUHB=0u5BeyXVTYmu3A; _T_WL=1"}

# 爬取 MONGO_TABLE_ID 表中用户序号在 [BEGIN_INDEX, _) 区间内的用户的微博所有数据
BEGIN_INDEX = 5590
