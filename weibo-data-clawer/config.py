# Mongo 数据库
MONGO_URL = 'localhost'
MONGO_DB = 'Weibo'
MONGO_TABLE_BLOGGER = 'blogger_info'
MONGO_TABLE_WEIBO = 'weibo_content'
MONGO_TABLE_ID = 'user_id'
MONGO_TABLE_FRIEND = 'blogger_friend'

# 每个博主爬取的微博上限
WEIBO_NUMBER_MAX = 50   # 50 条
WEIBO_DAYS_MAX = 90     # 3 个月

COOKIE = {"Cookie": "ALF=1547708441; SUB=_2A25xGKppDeRhGeVM7lcR9y_PyziIHXVS4jYhrDV6PUJbkdAKLXXgkW1NTLxziTc"
                    "RyMbhcu9QREH6osD5GwRBukFr; SUHB=0vJYZrqqyWEkoX; SCF=AsA34-dLr8-JsLCqXeR2_WUpwRiVdls9t"
                    "qe4SJR8hVgOjLF6q6MzjGeUuNRmZZ1qOx-S8KlRlIT7baCmJJ3CCrk.; _T_WM=c54bc06defef8599c61a03"
                    "7e1e7c969b; _WEIBO_UID=3255071304"}
HEADER = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) "
                        "Chrome/70.0.3538.110 Safari/537.36"}

# 爬取 MONGO_TABLE_ID 表中用户序号在 [BEGIN_INDEX, END_INDEX) 区间内的用户的微博所有数据
BEGIN_INDEX = 0
END_INDEX = 200
