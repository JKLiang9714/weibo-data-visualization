import re
import sys
import traceback
from datetime import datetime
from datetime import timedelta
from lxml import etree

from util.request_url import request_url
from config import *


class BloggerWeibo:
    # BloggerWeibo类初始化
    def __init__(self, user_id, filter=0):
        self.user_id = int(user_id)     # 用户id，如昵称为“Dear-迪丽热巴”的id为1669879400
        self.filter = filter    # 取值范围为0、1，程序默认值为0，代表要爬取用户的全部微博，1代表只爬取用户的原创微博
        self.weibo_crawl_num = 0    # 爬取到的微博数
        self.weibo_content = []     # 微博内容
        self.weibo_place = []       # 微博位置
        self.publish_time = []      # 微博发布时间
        self.up_num = []            # 微博对应的点赞数
        self.retweet_num = []       # 微博对应的转发数
        self.comment_num = []       # 微博对应的评论数
        self.publish_tool = []      # 微博发布工具

    # 获取用户微博内容，以及对应的发布时间、点赞数、转发数、评论数
    def get_weibo_info(self):
        try:
            url = "https://weibo.cn/u/%d?filter=%d&page=1" % (self.user_id, self.filter)
            html = request_url(url)
            selector = etree.HTML(html)
            if selector.xpath("//input[@name='mp']"):
                page_num = int(selector.xpath("//input[@name='mp']")[0].attrib["value"])
            else:
                page_num = 1

            stop_crawler = False    # 判断是否已抓取到足够分析的微博数
            for page in range(1, page_num + 1):
                url2 = "https://weibo.cn/u/%d?filter=%d&page=%d" % (self.user_id, self.filter, page)
                html2 = request_url(url2)
                selector2 = etree.HTML(html2)
                info = selector2.xpath("//div[@class='c']")
                if info[0].xpath("div/span[@class='ctt']"):
                    for i in range(0, len(info) - 2):
                        # 微博内容
                        weibo_content = self.get_weibo_content(info[i])
                        self.weibo_content.append(weibo_content)
                        # print(weibo_content)

                        # 微博位置
                        weibo_place = self.get_weibo_place(info[i])
                        self.weibo_place.append(weibo_place)
                        # print(u"微博位置: " + weibo_place)

                        # 微博发布时间
                        publish_time, publish_tool = self.get_weibo_time_tool(info[i])
                        self.publish_time.append(publish_time)
                        self.publish_tool.append(publish_tool)
                        # print(u"微博发布时间: " + publish_time)
                        # print(u"微博发布工具: " + publish_tool)

                        # 微博点赞、评论、转发数
                        up_num, retweet_num, comment_num = self.get_weibo_up_retweet_comment(info[i])
                        self.up_num.append(up_num)
                        self.comment_num.append(comment_num)
                        self.retweet_num.append(retweet_num)
                        # print(u"点赞数: " + str(up_num))
                        # print(u"评论数: " + str(comment_num))
                        # print(u"转发数: " + str(retweet_num))
                        # print("===========================================================================")

                        self.weibo_crawl_num += 1

                        # 当微博时间超出至今 WEIBO_DAYS_MAX 天、且已爬取数量超过 WEIBO_NUMBER_MAX 条时，停止爬取
                        if (datetime.now() - datetime.strptime(publish_time, "%Y-%m-%d %H:%M")).days \
                                >= WEIBO_DAYS_MAX and self.weibo_crawl_num >= WEIBO_NUMBER_MAX:
                            stop_crawler = True
                            break
                if stop_crawler:
                    break
        except Exception as e:
            print("Error: ", e)
            traceback.print_exc()

    # 获取微博内容
    def get_weibo_content(self, info):
        str_t = info.xpath("div/span[@class='ctt']")
        weibo_content = str_t[0].xpath("string(.)").replace(u"\u200b", "").encode(
            sys.stdout.encoding, "ignore").decode(sys.stdout.encoding)
        weibo_content = weibo_content[:-1]
        weibo_id = info.xpath("@id")[0][2:]
        a_link = info.xpath("div/span[@class='ctt']/a")
        is_retweet = info.xpath("div/span[@class='cmt']")
        if a_link:
            if a_link[-1].xpath("text()")[0] == u"全文":
                weibo_link = "https://weibo.cn/comment/" + weibo_id
                wb_content = self.get_long_weibo(weibo_link)
                if wb_content:
                    if not is_retweet:
                        wb_content = wb_content[1:]
                    weibo_content = wb_content
        if is_retweet:
            weibo_content = self.get_retweet(is_retweet, info, weibo_content)
        return weibo_content

    # 获取"长微博"全部文字内容
    @staticmethod
    def get_long_weibo(weibo_link):
        try:
            html = request_url(weibo_link)
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
    @staticmethod
    def get_retweet(is_retweet, info, wb_content):
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

    # 获取微博位置
    @staticmethod
    def get_weibo_place(info):
        div_first = info.xpath("div")[0]
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
        return weibo_place

    # 获取微博时间和工具
    @staticmethod
    def get_weibo_time_tool(info):
        str_time = info.xpath("div/span[@class='ct']")
        str_time = str_time[0].xpath("string(.)").encode(
            sys.stdout.encoding, "ignore").decode(sys.stdout.encoding)

        # 发布时间
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

        # 发布工具
        if len(str_time.split(u'来自')) > 1:
            publish_tool = str_time.split(u'来自')[1]
        else:
            publish_tool = u"无"

        return publish_time, publish_tool

    # 获取微博点赞、评论、转发数
    @staticmethod
    def get_weibo_up_retweet_comment(info):
        pattern = r"\d+\.?\d*"
        str_footer = info.xpath("div")[-1]
        str_footer = str_footer.xpath("string(.)").encode(
            sys.stdout.encoding, "ignore").decode(sys.stdout.encoding)
        str_footer = str_footer[str_footer.rfind(u'赞'):]
        guid = re.findall(pattern, str_footer, re.M)
        up_num = int(guid[0])       # 点赞数
        retweet_num = int(guid[1])  # 转发数
        comment_num = int(guid[2])  # 评论数
        return up_num, retweet_num, comment_num
