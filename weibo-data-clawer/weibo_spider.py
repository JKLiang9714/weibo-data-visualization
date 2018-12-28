import re
import requests
import sys
import traceback
import pymongo
from datetime import datetime
from datetime import timedelta
from lxml import etree

from util.write_to_txt import write_txt
from util.save_to_mongo import user_in_table, save_mongo
from util.user_id_spider import follow_all_id
from config import *

client = pymongo.MongoClient(MONGO_URL, connect=False)
db = client[MONGO_DB]
blogger_table = MONGO_TABLE_BLOGGER
weibo_table = MONGO_TABLE_WEIBO
id_table = MONGO_TABLE_ID
friend_table = MONGO_TABLE_FRIEND


class Weibo:
    cookie = COOKIE
    header = HEADER

    # Weibo类初始化
    def __init__(self, user_id, filter=0):
        self.user_id = int(user_id)     # 用户id，即需要我们输入的数字，如昵称为“Dear-迪丽热巴”的id为1669879400
        self.filter = filter    # 取值范围为0、1，程序默认值为0，代表要爬取用户的全部微博，1代表只爬取用户的原创微博
        self.username = ''          # 用户名，如“Dear-迪丽热巴”
        self.sex = ''               # 性别
        self.birthplace = ''        # 地区
        self.weibo_num = 0          # 用户全部微博数
        self.weibo_num2 = 0         # 爬取到的微博数
        self.following = 0          # 用户关注数
        self.followers = 0          # 用户粉丝数
        self.weibo_content = []     # 微博内容
        self.weibo_place = []       # 微博位置
        self.publish_time = []      # 微博发布时间
        self.up_num = []            # 微博对应的点赞数
        self.retweet_num = []       # 微博对应的转发数
        self.comment_num = []       # 微博对应的评论数
        self.publish_tool = []      # 微博发布工具
        self.friends = []           # 用户好友列表

    # 根据用户id，获取用户昵称、性别、地区
    def get_user_name_sex_place_by_id(self, id):
        try:
            global username, sex, birthplace
            url = "https://weibo.cn/%d/info" % id
            while True:
                response = requests.get(url, headers=self.header, cookies=self.cookie)
                if response.status_code == 200:
                    html = response.content
                    break
                print('未获取到网页内容，正在重试！')
            selector = etree.HTML(html)
            info = selector.xpath("//div[@class='c']/text()")
            for index in range(len(info)):
                if '昵称:' in info[index]:
                    username = info[index][3:]
                elif '性别:' in info[index]:
                    sex = info[index][3:]
                elif '地区:' in info[index]:
                    birthplace = info[index][3:]
            return username, sex, birthplace
        except Exception as e:
            print("Error: ", e)
            traceback.print_exc()

    # 获取用户昵称、性别、地区
    def get_user_name_sex_place(self):
        try:
            self.username, self.sex, self.birthplace = self.get_user_name_sex_place_by_id(self.user_id)
            print(u"用户名: " + self.username)
            print(u"性别: " + self.sex)
            print(u"地区: " + self.birthplace)
        except Exception as e:
            print("Error: ", e)
            traceback.print_exc()

    # 获取用户个人基本信息
    def get_user_info(self):
        # 获取用户昵称、性别、地区
        self.get_user_name_sex_place()

        # 获取用户微博数、关注数、粉丝数
        try:
            url = "https://weibo.cn/u/%d?filter=%d&page=1" % (self.user_id, self.filter)
            while True:
                response = requests.get(url, headers=self.header, cookies=self.cookie)
                if response.status_code == 200:
                    html = response.content
                    break
                print('未获取到网页内容，正在重试！')
            selector = etree.HTML(html)
            pattern = r"\d+\.?\d*"
            # 微博数
            str_wb = selector.xpath("//div[@class='tip2']/span[@class='tc']/text()")[0]
            guid = re.findall(pattern, str_wb, re.S | re.M)
            self.weibo_num = int(guid[0])
            print(u"微博数: " + str(self.weibo_num))

            # 关注数
            str_gz = selector.xpath("//div[@class='tip2']/a/text()")[0]
            guid = re.findall(pattern, str_gz, re.M)
            self.following = int(guid[0])
            print(u"关注数: " + str(self.following))

            # 粉丝数
            str_fs = selector.xpath("//div[@class='tip2']/a/text()")[1]
            guid = re.findall(pattern, str_fs, re.M)
            self.followers = int(guid[0])
            print(u"粉丝数: " + str(self.followers))
        except Exception as e:
            print("Error: ", e)
            traceback.print_exc()

    # 获取"长微博"全部文字内容
    def get_long_weibo(self, weibo_link):
        try:
            while True:
                response = requests.get(weibo_link, headers=self.header, cookies=self.cookie)
                if response.status_code == 200:
                    html = response.content
                    break
                print('未获取到网页内容，正在重试！')
            selector = etree.HTML(html)
            info = selector.xpath("//div[@class='c']")[1]
            info = info.xpath("div/span[@class='ctt']")
            if info:
                wb_content = info[0].xpath("string(.)").replace(u"\u200b", "")\
                    .encode(sys.stdout.encoding, "ignore").decode(sys.stdout.encoding)
                return wb_content
            else:
                return ""
        except Exception as e:
            print("Error: ", e)
            traceback.print_exc()

    # 获取转发微博信息
    def get_retweet(self, is_retweet, info, wb_content):
        try:
            original_user = is_retweet[0].xpath("a/text()")
            if not original_user:
                wb_content = u"转发微博已被删除"
                return wb_content
            else:
                original_user = original_user[0]
            retweet_reason = info.xpath("div")[-1].xpath("string(.)").replace(u"\u200b", "").encode(
                sys.stdout.encoding, "ignore").decode(sys.stdout.encoding)
            retweet_reason = retweet_reason[:retweet_reason.rindex(u"赞")]
            wb_content = retweet_reason + "\n" + u"原始用户: " + original_user + "\n" + u"转发内容: " + wb_content
            return wb_content
        except Exception as e:
            print("Error: ", e)
            traceback.print_exc()

    # 获取用户微博内容，以及对应的发布时间、点赞数、转发数、评论数
    def get_weibo_info(self):
        try:
            url = "https://weibo.cn/u/%d?filter=%d&page=1" % (self.user_id, self.filter)
            while True:
                response = requests.get(url, headers=self.header, cookies=self.cookie)
                if response.status_code == 200:
                    html = response.content
                    break
                print('未获取到网页内容，正在重试！')
            selector = etree.HTML(html)
            if selector.xpath("//input[@name='mp']"):
                page_num = int(selector.xpath("//input[@name='mp']")[0].attrib["value"])
            else:
                page_num = 1
            pattern = r"\d+\.?\d*"
            stop_clawer = False  # 判断是否已抓取到足够分析的微博数
            for page in range(1, page_num + 1):
                url2 = "https://weibo.cn/u/%d?filter=%d&page=%d" % (self.user_id, self.filter, page)
                while True:
                    response = requests.get(url2, headers=self.header, cookies=self.cookie)
                    if response.status_code == 200:
                        html2 = response.content
                        break
                    print('未获取到网页内容，正在重试！')
                selector2 = etree.HTML(html2)
                info = selector2.xpath("//div[@class='c']")
                is_empty = info[0].xpath("div/span[@class='ctt']")
                if is_empty:
                    for i in range(0, len(info) - 2):
                        # 微博内容
                        str_t = info[i].xpath("div/span[@class='ctt']")
                        weibo_content = str_t[0].xpath("string(.)").replace(u"\u200b", "").encode(
                            sys.stdout.encoding, "ignore").decode(sys.stdout.encoding)
                        weibo_content = weibo_content[:-1]
                        weibo_id = info[i].xpath("@id")[0][2:]
                        a_link = info[i].xpath("div/span[@class='ctt']/a")
                        is_retweet = info[i].xpath("div/span[@class='cmt']")
                        if a_link:
                            if a_link[-1].xpath("text()")[0] == u"全文":
                                weibo_link = "https://weibo.cn/comment/" + weibo_id
                                wb_content = self.get_long_weibo(weibo_link)
                                if wb_content:
                                    if not is_retweet:
                                        wb_content = wb_content[1:]
                                    weibo_content = wb_content
                        if is_retweet:
                            weibo_content = self.get_retweet(is_retweet, info[i], weibo_content)
                        self.weibo_content.append(weibo_content)
                        # print(weibo_content)

                        # 微博位置
                        div_first = info[i].xpath("div")[0]
                        a_list = div_first.xpath("a")
                        weibo_place = u"无"
                        for a in a_list:
                            if "place.weibo.com" in a.xpath("@href")[0] and a.xpath("text()")[0] == u"显示地图":
                                weibo_a = div_first.xpath("span[@class='ctt']/a")
                                if len(weibo_a) >= 1:
                                    weibo_place = weibo_a[-1]
                                    if u"的秒拍视频" in div_first.xpath("span[@class='ctt']/a/text()")[-1]:
                                        if len(weibo_a) >= 2:
                                            weibo_place = weibo_a[-2]
                                        else:
                                            weibo_place = u"无"
                                    weibo_place = weibo_place.xpath("string(.)").encode(
                                        sys.stdout.encoding, "ignore").decode(sys.stdout.encoding)
                                    break
                        self.weibo_place.append(weibo_place)
                        # print(u"微博位置: " + weibo_place)

                        # 微博发布时间
                        str_time = info[i].xpath("div/span[@class='ct']")
                        str_time = str_time[0].xpath("string(.)").encode(
                            sys.stdout.encoding, "ignore").decode(sys.stdout.encoding)
                        publish_time = str.strip(str_time.split(u'来自')[0])
                        if u"刚刚" in publish_time:
                            publish_time = datetime.now().strftime('%Y-%m-%d %H:%M')
                        elif u"分钟" in publish_time:
                            minute = publish_time[:publish_time.find(u"分钟")]
                            minute = timedelta(minutes=int(minute))
                            publish_time = (datetime.now() - minute).strftime("%Y-%m-%d %H:%M")
                        elif u"今天" in publish_time:
                            today = datetime.now().strftime("%Y-%m-%d")
                            time = publish_time[3:]
                            publish_time = today + " " + time
                        elif u"月" in publish_time:
                            year = datetime.now().strftime("%Y")
                            month = publish_time[0:2]
                            day = publish_time[3:5]
                            time = publish_time[7:12]
                            publish_time = year + "-" + month + "-" + day + " " + time
                        else:
                            publish_time = publish_time[:16]
                        self.publish_time.append(publish_time)
                        # print(u"微博发布时间: " + publish_time)

                        # 微博发布工具
                        if len(str_time.split(u'来自')) > 1:
                            publish_tool = str_time.split(u'来自')[1]
                        else:
                            publish_tool = u"无"
                        self.publish_tool.append(publish_tool)
                        # print(u"微博发布工具: " + publish_tool)

                        str_footer = info[i].xpath("div")[-1]
                        str_footer = str_footer.xpath("string(.)").encode(
                            sys.stdout.encoding, "ignore").decode(sys.stdout.encoding)
                        str_footer = str_footer[str_footer.rfind(u'赞'):]
                        guid = re.findall(pattern, str_footer, re.M)

                        # 点赞数
                        up_num = int(guid[0])
                        self.up_num.append(up_num)
                        # print(u"点赞数: " + str(up_num))

                        # 转发数
                        retweet_num = int(guid[1])
                        self.retweet_num.append(retweet_num)
                        # print(u"转发数: " + str(retweet_num))

                        # 评论数
                        comment_num = int(guid[2])
                        self.comment_num.append(comment_num)
                        # print(u"评论数: " + str(comment_num))
                        # print("===========================================================================")

                        self.weibo_num2 += 1

                        # 当微博时间超出至今 WEIBO_DAYS_MAX 天、且已爬取数量超过 WEIBO_NUMBER_MAX 条时，停止爬取
                        if (datetime.now() - datetime.strptime(publish_time, "%Y-%m-%d %H:%M")).days \
                                >= WEIBO_DAYS_MAX and self.weibo_num2 >= WEIBO_NUMBER_MAX:
                            stop_clawer = True
                            break
                if stop_clawer:
                    break
        except Exception as e:
            print("Error: ", e)
            traceback.print_exc()

    # 获取用户好友列表（即关注的博主）
    def get_user_friend(self):
        try:
            friend_id_list = follow_all_id(self.user_id)
            friend_list = []
            for friend_id in friend_id_list:
                friend_id = friend_id['user_id']
                temp = self.get_user_name_sex_place_by_id(int(friend_id))
                if temp is not None:
                    friend_name, friend_sex, friend_place = temp
                    friend_list.append({
                        'name': friend_name,
                        'sex': friend_sex,
                        'birthplace': friend_place
                    })
            self.friends = friend_list
        except Exception as e:
            print("Error: ", e)
            traceback.print_exc()


# 运行爬虫
def start_crawler(weibo):
    try:
        weibo.get_user_info()       # 获取用户基本信息
        weibo.get_weibo_info()      # 获取用户微博详情
        weibo.get_user_friend()     # 获取用户好友列表
    except Exception as e:
        print("Error: ", e)
        traceback.print_exc()


# 获取所有用户id
def get_ids(db, table):
    try:
        id_list = []
        for each_id_document in db[table].find():
            id_list.append(each_id_document['user_id'])
        return id_list
    except Exception as e:
        print("Error: ", e)
        traceback.print_exc()


def main():
    try:
        # 获取数据库中id表中的所有用户id，准备抓取所有id的微博信息
        user_ids = get_ids(db, id_table)
        for user_id in user_ids[BEGIN_INDEX : END_INDEX]:
            # 对于每一个用户id，所有信息都会存储在weibo实例中
            filter = 1  # 值为0表示爬取全部微博（原创微博+转发微博），值为1表示只爬取原创微博
            weibo = Weibo(user_id, filter)  # 调用Weibo类，创建微博实例wb

            if user_in_table(db, blogger_table, user_id):
                temp = weibo.get_user_name_sex_place_by_id(int(user_id))
                if temp is not None:
                    name_of_id, _, _ = temp
                    print('用户: %s, 信息已存在于MONGODB！' % name_of_id)
            else:
                start_crawler(weibo)            # 爬取微博信息
                # write_txt(weibo)               # 存储所有微博信息到txt中
                save_mongo(db, blogger_table, weibo_table, friend_table, weibo)  # 存储所有微博信息到mongodb中
                # print(u"用户名: " + weibo.username)
                # print(u"全部微博数: " + str(weibo.weibo_num))
                # print(u"关注数: " + str(weibo.following))
                # print(u"粉丝数: " + str(weibo.followers))
            print("===========================================================================")
    except Exception as e:
        print("Error: ", e)
        traceback.print_exc()


if __name__ == "__main__":
    main()
