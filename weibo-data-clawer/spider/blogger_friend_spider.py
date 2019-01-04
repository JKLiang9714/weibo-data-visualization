import traceback

from spider.user_id_spider import follow_all_id


class BloggerFriend:
    def __init__(self, user_id):
        self.user_id = int(user_id)     # 用户id，如昵称为“Dear-迪丽热巴”的id为1669879400
        self.friends = []               # 用户好友列表

    # 获取用户好友列表（即关注的博主）
    def get_user_friend(self):
        try:
            friend_id_list = follow_all_id(self.user_id)
            friend_list = []
            for friend_id in friend_id_list:
                friend_id = friend_id['id']
                friend_list.append({
                    'id': friend_id
                })
            self.friends = friend_list
        except Exception as e:
            print("Error: ", e)
            traceback.print_exc()
