import traceback
import pymongo

from config import *

client = pymongo.MongoClient(MONGO_URL, connect=False)
db = client[MONGO_DB]
id_table = MONGO_TABLE_USER_ID
blogger_info_table = MONGO_TABLE_BLOGGER_INFO
weibo_content_table = MONGO_TABLE_WEIBO_CONTENT
blogger_friend_table = MONGO_TABLE_BLOGGER_FRIEND


# 判断{'id': user_id}数据是否在blogger_info表中
def user_in_info_table(user_id):
    try:
        if db[blogger_info_table].find_one({'id': user_id}):
            return True
        return False
    except Exception as e:
        print(e.__traceback__)


# 判断{'id': user_id}数据是否在weibo_content表中
def user_in_weibo_table(user_id):
    try:
        if db[weibo_content_table].find_one({'id': user_id}):
            return True
        return False
    except Exception as e:
        print(e.__traceback__)


# 判断{'id': user_id}数据是否在blogger_friend表中
def user_in_friend_table(user_id):
    try:
        if db[blogger_friend_table].find_one({'id': user_id}):
            return True
        return False
    except Exception as e:
        print(e.__traceback__)


# 判断用户是否合法
def user_is_valid(info):
    if info.username == '' or info.sex == '' or info.birthplace == '' or \
            info.weibo_num == -1 or info.following == -1 or info.followers == -1:
        return False
    return True


# 将信息存入 blogger_info 表中
def save_to_info(info):
    try:
        if user_in_info_table(str(info.user_id)):
            print('该用户的基本信息已存在于 blogger_info 表中！')
        else:
            if not user_is_valid(info):
                print('未找到该用户的基本信息！')
            else:
                # 存储博主的基本信息到数据库中的 blogger_info 表
                blogger_info_dict = {}
                blogger_info_dict.update({
                    'id': str(info.user_id),
                    'name': info.username,
                    'sex': info.sex,
                    'birthplace': info.birthplace,
                    'weibo_num': info.weibo_num,
                    'following': info.following,
                    'followers': info.followers
                })
                db[blogger_info_table].insert(blogger_info_dict)
                print('该用户的基本信息已成功存储到 blogger_info 表中！')
    except Exception as e:
        print("Error: ", e)
        traceback.print_exc()


# 将信息存入 weibo_content 表中
def save_to_weibo(weibo):
    try:
        if user_in_weibo_table(weibo.user_id):
            print('该用户的微博信息已存在于 weibo_content 表中！')
        else:
            # 存储博主的微博信息到数据库中的 weibo_content 表
            weibo_content_dict = {}
            weibo_content_list = []
            for i in range(1, weibo.weibo_crawl_num + 1):
                weibo_content = {
                    'publish_content': weibo.weibo_content[i - 1],
                    'publish_location': weibo.weibo_place[i - 1],
                    'publish_time': weibo.publish_time[i - 1],
                    'like': weibo.up_num[i - 1],
                    'forward': weibo.retweet_num[i - 1],
                    'comment': weibo.comment_num[i - 1],
                    'publish_tool': weibo.publish_tool[i - 1]
                }
                weibo_content_list.append(weibo_content)

            weibo_content_dict.update({
                'id': str(weibo.user_id),
                'weibo_content': weibo_content_list
            })
            db[weibo_content_table].insert(weibo_content_dict)
            if len(weibo_content_list) == 0:
                print("未找到该用户的微博信息！")
            else:
                print('该用户的微博信息已成功存储到 weibo_content 表中！共' + str(len(weibo_content_list)) + '条')
    except Exception as e:
        print("Error: ", e)
        traceback.print_exc()


# 将信息存入 blogger_friend 表中
def save_to_friend(friend):
    try:
        if user_in_friend_table(friend.user_id):
            print('该用户的好友信息已存在于 blogger_friend 表中！')
        else:
            # 存储博主的好友信息到数据库中的 blogger_friend 表
            blogger_friends_dict = {}

            blogger_friends_dict.update({
                'id': str(friend.user_id),
                'friends': friend.friends
            })
            db[blogger_friend_table].insert(blogger_friends_dict)
            if len(friend.friends) == 0:
                print("未找到该用户的好友信息！")
            else:
                print('该用户的好友信息已成功存储到 blogger_friend 表中！共' + str(len(friend.friends)) + '条')

            # 将二级好友ID也存入表id_table
            if len(friend.not_in_id_table_friends) > 0:
                db[id_table].insert_many(friend.not_in_id_table_friends)
                print('该用户的好友ID已成功存储到 user_id 表中！共' + str(len(friend.not_in_id_table_friends)) + '条')
    except Exception as e:
        print("Error: ", e)
        traceback.print_exc()


# 获取数据库中user_id表中的所有用户id
def get_ids():
    try:
        id_list = []
        for each_id_document in db[id_table].find():
            id_list.append(each_id_document['id'])
        return id_list
    except Exception as e:
        print("Error: ", e)
        traceback.print_exc()


# 获取数据库中user_id表中用户的个数
def get_user_number():
    try:
        return db[id_table].count()
    except Exception as e:
        print("Error: ", e)
        traceback.print_exc()
