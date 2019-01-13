# 数据库说明
数据库采用MongoDB

## 数据库中各表的含义及结构
数据库中共有4个Collection：blogger\_info、weibo\_content、blogger\_friend、user\_id，以下进行详细说明

![](https://i.imgur.com/6lnBAUT.png)


### blogger_info
1. 含义：存储博主的个人信息
2. 字段说明
	- id：博主的微博ID
	- name：微博昵称
	- sex：性别
	- birthplace：生源地
	- weibo_num：微博数
	- following：关注好友数
	- followers：粉丝数

![](https://i.imgur.com/ASaAvvK.png)


### weibo_content
1. 含义：存储博主的微博详情
2. 字段说明
	- id：博主的微博ID
	- weibo_content：微博详情
		- publish_content：发布内容
		- publish_location：发布位置
		- publish_time：发布时间
		- like：点赞数
		- forward：转发数
		- comment：评论数

![](https://i.imgur.com/ZG8uX2G.jpg)


### blogger_friend
1. 含义：存储博主的好友列表
2. 字段说明
	- id：博主的微博ID
	- friends：好友列表
		- id：好友的微博ID

![](https://i.imgur.com/RR9AoBI.png)


### user_id
1. 含义：存储全部博主的微博ID
2. 字段说明
	- id：博主的微博ID
3. 特殊说明：该collection是一边爬取博主的好友，一边存储其好友ID

![](https://i.imgur.com/hAuHgIR.png)



## 如何恢复数据库
在命令行界面分别输入以下命令：

    mongoimport -d Weibo -c blogger_info (weibo-mongodb-data 的路径)/blogger_info.dat

    mongoimport -d Weibo -c weibo_content (weibo-mongodb-data 的路径)/weibo_content.dat

    mongoimport -d Weibo -c blogger_friend (weibo-mongodb-data 的路径)/blogger_friend.dat

    mongoimport -d Weibo -c user_id (weibo-mongodb-data 的路径)/user_id.dat


## 数据爬取过程
![](https://i.imgur.com/BWKkRtU.png)


## 爬取说明
- 博主的好友列表：即博主的关注列表
- 对于关注列表、粉丝列表，新浪微博最多只能查看最新关注的200个用户，跟爬虫技术无关
- 为了便于数据分析，在爬取过程中进行了如下剪枝（在config.py中可以自定义）：
	- 每位博主最多只爬取20位好友
	- 每位博主最多只爬取1年以内的微博信息，同时限制不超过300条
- 好友列表中只有好友的id字段信息，如果需要获取好友的基本信息和微博信息等，可以用id到基本信息表和微博信息表中查找
