import traceback


# 判断{'id': user_id}数据是否在table中
def user_in_table(db, table, user_id):
    try:
        if db[table].find_one({'id': user_id}):
            return True
        return False
    except Exception as e:
        print(e.__traceback__)


# 将weibo中的信息分别存入blogger_table, weibo_table, friend_table中
def save_mongo(db, blogger_table, weibo_table, friend_table, weibo):
    try:
        if user_in_table(db, blogger_table, str(weibo.user_id)):
            print('用户: %s, 信息已存在于MONGODB！' % weibo.username)
        else:
            # 存储博主的基本信息到 blogger_table，即数据库中的 blogger_info 表
            blogger_info_dict = {}
            blogger_info_dict.update({
                'name': weibo.username,
                'id': str(weibo.user_id),
                'sex': weibo.sex,
                'birthplace': weibo.birthplace,
                'weibo_num': weibo.weibo_num,
                'following': weibo.following,
                'followers': weibo.followers
            })
            db[blogger_table].insert(blogger_info_dict)

            # 存储博主的微博信息到 weibo_table，即数据库中的 weibo_content 表
            weibo_content_dict = {}
            weibo_content_list = []
            for i in range(1, weibo.weibo_num2 + 1):
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
                'name': weibo.username,
                'weibo_content': weibo_content_list
            })
            db[weibo_table].insert(weibo_content_dict)

            # 存储博主的好友信息到 friend_table，即数据库中的 blogger_friend 表
            blogger_friends_dict = {}
            blogger_friends_list = []
            for i in range(len(weibo.friends)):
                friend = {
                    'name': weibo.friends[i]['name'],
                    'sex': weibo.friends[i]['sex'],
                    'birthplace': weibo.friends[i]['birthplace']
                }
                blogger_friends_list.append(friend)
            blogger_friends_dict.update({
                'name': weibo.username,
                'friends': blogger_friends_list
            })
            db[friend_table].insert(blogger_friends_dict)

            print('用户: %s, 信息存储到MONGODB成功！' % weibo.username)
    except Exception as e:
        print("Error: ", e)
        traceback.print_exc()
