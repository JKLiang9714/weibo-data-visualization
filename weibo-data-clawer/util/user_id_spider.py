import re
import requests
import pymongo
from lxml import etree

from config import *

client = pymongo.MongoClient(MONGO_URL, connect=False)
db = client[MONGO_DB]
id_table = MONGO_TABLE_ID
cookie = COOKIE
header = HEADER


def follow_all_id(user_id):
    url = "https://weibo.cn/%d/follow?page=1" % user_id
    while True:
        response = requests.get(url, headers=header, cookies=cookie)
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
    follow_id_dict_list = []
    for page in range(1, page_num + 1):
        url2 = "https://weibo.cn/%d/follow?page=%d" % (user_id, page)
        while True:
            response = requests.get(url2, headers=header, cookies=cookie)
            if response.status_code == 200:
                html2 = response.content
                break
            print('未获取到网页内容，正在重试！')
        selector2 = etree.HTML(html2)
        info = selector2.xpath("//td[@valign='top'][last()]/a[last()]/@href")

        for index in range(len(info)):
            id = re.findall(pattern, info[index], re.S | re.M)
            if id:
                id = id[0]
                insert_id = {'user_id': id}
                if not db[id_table].find_one(insert_id):
                    follow_id_dict_list.append(insert_id)
    return follow_id_dict_list


if __name__ == '__main__':
    # 以谢娜的用户ID为根节点，抓取她关注的博主ID，作为ID数据库
    follow_ids = follow_all_id(1192329374)
    if follow_ids:
        db[id_table].insert_many(follow_ids)
