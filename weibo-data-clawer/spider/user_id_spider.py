import re
import pymongo
import urllib
from lxml import etree

from config import *
from util.request_url import request_url

client = pymongo.MongoClient(MONGO_URL, connect=False)
db = client[MONGO_DB]
id_table = MONGO_TABLE_USER_ID


# 根据一个userID找出他/她所有关注的好友的userID
def follow_all_id(user_id):
    url = "https://weibo.cn/%d/follow?page=1" % user_id
    html = request_url(url)
    selector = etree.HTML(html)
    if selector.xpath("//input[@name='mp']"):
        page_num = int(selector.xpath("//input[@name='mp']")[0].attrib["value"])
    else:
        page_num = 1

    # 若某用户的好友数为20，则要抓取好友的好友的好友，即第三层好友，需要抓取 20*20*20=8000 位用户时，才能获取到
    # 为了能多抓间接好友关系，这里对第一层好友进行剪枝，每个人最多只抓 FRIEND_PAGE_MAX 页，即 FRIEND_PAGE_MAX*10 个好友
    # 注意：新浪微博本身就限制了最多只能看到20页（weibo.cn），weibo.com会更少
    if page_num > FRIEND_PAGE_MAX:
        page_num = FRIEND_PAGE_MAX

    pattern = r"\d+\.?\d*"
    follow_id_dict_list = []
    follow_id_not_in_id_table_dict_list = []
    for page in range(1, page_num + 1):
        url2 = "https://weibo.cn/%d/follow?page=%d" % (user_id, page)
        html2 = request_url(url2)
        selector2 = etree.HTML(html2)
        info = selector2.xpath("//td[@valign='top'][last()]/a[last()]/@href")

        for index in range(len(info)):
            id = re.findall(pattern, info[index], re.S | re.M)
            if id:
                id = id[0]
                insert_id = {'id': id}
                if not db[id_table].find_one(insert_id):
                    follow_id_not_in_id_table_dict_list.append(insert_id)
                follow_id_dict_list.append(insert_id)
    return follow_id_not_in_id_table_dict_list, follow_id_dict_list


# 根据一个username找出他/她的userID
def follow_all_id_by_name(username):
    url = "https://weibo.cn/find/user"
    word = {"keyword": username, "suser": 2}
    word = urllib.parse.urlencode(word)  # 转换成url编码格式(字符串)
    new_url = url + "?" + word
    html = request_url(new_url)
    selector = etree.HTML(html)
    if selector.xpath("//td[@valign='top']"):
        s = selector.xpath("//td[@valign='top']/a")[0].attrib["href"]
        print("https://weibo.cn" + s)


if __name__ == '__main__':
    # 以谢娜的用户ID为根节点，抓取她关注的博主ID，作为ID数据库
    follow_ids = follow_all_id(1192329374)
    print(len(follow_ids))
    # if follow_ids:
    #     db[id_table].insert_many(follow_ids)

    # follow_all_id_by_name("黎姿")
