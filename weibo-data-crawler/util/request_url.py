import requests
import random
import time
from config import *

USER_AGENTS = [
    "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; AcooBrowser; .NET CLR 1.1.4322; .NET CLR 2.0.50727)",
    "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0; Acoo Browser; SLCC1; .NET CLR 2.0.50727; Media Center PC 5.0; .NET CLR 3.0.04506)",
    "Mozilla/4.0 (compatible; MSIE 7.0; AOL 9.5; AOLBuild 4337.35; Windows NT 5.1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)",
    "Mozilla/5.0 (Windows; U; MSIE 9.0; Windows NT 9.0; en-US)",
    "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET CLR 2.0.50727; Media Center PC 6.0)",
    "Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0; WOW64; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET CLR 1.0.3705; .NET CLR 1.1.4322)",
    "Mozilla/4.0 (compatible; MSIE 7.0b; Windows NT 5.2; .NET CLR 1.1.4322; .NET CLR 2.0.50727; InfoPath.2; .NET CLR 3.0.04506.30)",
    "Mozilla/5.0 (Windows; U; Windows NT 5.1; zh-CN) AppleWebKit/523.15 (KHTML, like Gecko, Safari/419.3) Arora/0.3 (Change: 287 c9dfb30)",
    "Mozilla/5.0 (X11; U; Linux; en-US) AppleWebKit/527+ (KHTML, like Gecko, Safari/419.3) Arora/0.6",
    "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.2pre) Gecko/20070215 K-Ninja/2.1.1",
    "Mozilla/5.0 (Windows; U; Windows NT 5.1; zh-CN; rv:1.9) Gecko/20080705 Firefox/3.0 Kapiko/3.0",
    "Mozilla/5.0 (X11; Linux i686; U;) Gecko/20070322 Kazehakase/0.4.5",
    "Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.8) Gecko Fedora/1.9.0.8-1.fc10 Kazehakase/0.5.6",
    "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.56 Safari/535.11",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/535.20 (KHTML, like Gecko) Chrome/19.0.1036.7 Safari/535.20",
    "Opera/9.80 (Macintosh; Intel Mac OS X 10.6.8; U; fr) Presto/2.9.168 Version/11.52",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36"
]

cookie = COOKIE
headers = {"User-Agent": random.choice(USER_AGENTS)}

# 代理服务器列表
proxyHostPort = [
    "49.82.221.48:4243",
    "116.248.161.93:4261",
    "116.248.167.161:4261",
    "14.106.106.12:4697",
    "182.110.238.187:7685",
    "125.123.46.173:4225",
    "119.115.245.62:4237",
    "182.34.195.80:4246",
    "140.255.147.173:4246",
    "182.246.158.144:4263",
    "183.166.133.235:6458",
    "112.245.195.123:4274",
    "183.164.76.218:4265",
    "121.205.190.111:4235",
    "49.70.123.49:4276",
    "118.120.187.140:4216",
    "182.86.191.229:4282",
    "112.113.156.28:4256",
    "114.230.201.145:4265",
    "183.154.243.40:4230",
]


def request_url(url):
    while True:
        response = requests.get(url, headers=headers, cookies=cookie)
        if response.status_code == 200:
            html = response.content
            break
        print('未获取到网页内容，正在重试！')
        time.sleep(random.random() * 300)
    return html


if __name__ == '__main__':
    while True:
        test_url = 'https://weibo.cn/'
        proxyMeta = "http://" + random.choice(proxyHostPort)
        proxies = {
            "http": proxyMeta,
            "https": proxyMeta,
        }
        print(proxies)
        try:
            test_response = requests.get(test_url, proxies=proxies)
            if test_response.status_code == 200:
                html = test_response.content
                print('Yes')
            else:
                print('No')
        except Exception as e:
            print("Error: ", e)
        time.sleep(1)
