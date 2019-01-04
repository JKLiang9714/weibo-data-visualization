import re
import traceback
from lxml import etree

from util.request_url import request_url


class BloggerInfo:
    def __init__(self, user_id):
        self.user_id = int(user_id)     # 用户id，如昵称为“Dear-迪丽热巴”的id为1669879400
        self.username = ''              # 用户名，如“Dear-迪丽热巴”
        self.sex = ''                   # 性别
        self.birthplace = ''            # 地区
        self.weibo_num = 0              # 用户全部微博数
        self.following = 0              # 用户关注数
        self.followers = 0              # 用户粉丝数

    # 调用get_basic_info, get_other_info，获取用户所有个人信息
    def get_user_info(self):
        self.username, self.sex, self.birthplace = self.get_basic_info(self.user_id)
        self.weibo_num, self.following, self.followers = self.get_other_info(self.user_id)

    # 根据用户id，获取用户昵称、性别、地区
    @staticmethod
    def get_basic_info(id):
        try:
            username = ''
            sex = ''
            birthplace = ''

            url = "https://weibo.cn/%d/info" % id
            html = request_url(url)
            selector = etree.HTML(html)
            info = selector.xpath("//div[@class='c']/text()")
            for index in range(len(info)):
                if '昵称:' in info[index]:
                    username = info[index][3:]
                elif '性别:' in info[index]:
                    sex = info[index][3:]
                elif '地区:' in info[index]:
                    birthplace = info[index][3:]
            print(u"用户名: " + username)
            print(u"性别: " + sex)
            print(u"地区: " + birthplace)
            return username, sex, birthplace
        except Exception as e:
            print("Error: ", e)
            traceback.print_exc()

    # 根据用户id，获取微博数、关注数、粉丝数
    @staticmethod
    def get_other_info(id):
        try:
            url = "https://weibo.cn/u/%d?page=1" % id
            html = request_url(url)
            selector = etree.HTML(html)
            pattern = r"\d+\.?\d*"
            # 微博数
            str_wb = selector.xpath("//div[@class='tip2']/span[@class='tc']/text()")[0]
            guid = re.findall(pattern, str_wb, re.S | re.M)
            weibo_num = int(guid[0])
            print(u"微博数: " + str(weibo_num))

            # 关注数
            str_gz = selector.xpath("//div[@class='tip2']/a/text()")[0]
            guid = re.findall(pattern, str_gz, re.M)
            following = int(guid[0])
            print(u"关注数: " + str(following))

            # 粉丝数
            str_fs = selector.xpath("//div[@class='tip2']/a/text()")[1]
            guid = re.findall(pattern, str_fs, re.M)
            followers = int(guid[0])
            print(u"粉丝数: " + str(followers))
            return weibo_num, following, followers
        except Exception as e:
            print("Error: ", e)
            traceback.print_exc()
