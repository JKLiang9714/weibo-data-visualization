import traceback
import time
import random

from spider.blogger_info_spider import BloggerInfo
from spider.blogger_weibo_spider import BloggerWeibo
from spider.blogger_friend_spider import BloggerFriend
from util.mongo_db import user_in_info_table, user_in_weibo_table, user_in_friend_table, \
    save_to_info, save_to_weibo, save_to_friend, get_ids, get_user_number
from config import BEGIN_INDEX


def main():
    try:
        number = get_user_number()
        # 获取数据库中id表中的所有用户id，准备抓取所有id的信息
        user_ids = get_ids()
        for user_id in user_ids[BEGIN_INDEX:]:
            print('正在抓取第 ' + str(number) + ' 位用户')
            # 爬取用户基本信息
            info = BloggerInfo(user_id)             # 调用BloggerInfo类，创建博主的信息实例info
            if user_in_info_table(user_id):
                print('该用户的基本信息已存在于 blogger_info 表中！')
            else:
                info.get_user_info()
                save_to_info(info)

            # 爬取用户微博详情
            filter = 1                              # 0：爬取全部微博，1：只爬取原创微博
            weibo = BloggerWeibo(user_id, filter)   # 调用BloggerWeibo类，创建博主的微博实例weibo
            if user_in_weibo_table(user_id):
                print('该用户的微博信息已存在于 weibo_content 表中！')
            else:
                weibo.get_weibo_info()
                save_to_weibo(weibo)

            # 爬取用户好友列表
            friend = BloggerFriend(user_id)         # 调用BloggerFriend类，创建博主的好友实例friend
            if user_in_friend_table(user_id):
                print('该用户的好友信息已存在于 blogger_friend 表中！')
            else:
                friend.get_user_friend()
                save_to_friend(friend)
                number += 1
            print("===========================================================================")
            time.sleep(random.random() * 10)

    except Exception as e:
        print("Error: ", e)
        traceback.print_exc()


if __name__ == "__main__":
    main()
