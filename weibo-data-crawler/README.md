## 数据展示

### 爬取过程截图
![](https://i.imgur.com/BWKkRtU.png)

### 博主的基本信息
![](https://i.imgur.com/gUxciiB.png)

### 博主的微博信息
![](https://i.imgur.com/0UBSKKz.jpg)

### 博主的好友关系
![](https://i.imgur.com/B3XCcLO.jpg)

### 爬取说明
- 博主的好友：即博主的关注列表
- 对于关注列表、粉丝列表，新浪微博最多只能查看最新关注的200个用户，跟爬虫技术无关
- 为了便于数据分析，在爬取过程中进行了如下剪枝（在config.py中可以自定义）：
	- 每位博主最多只爬取20位好友
	- 每位博主最多只爬取1年以内的微博信息，同时限制不超过300条
- 好友关系表中只抓取id，即如果需要获取好友的基本信息和微博信息等，可以用id到基本信息表和微博信息表中查找

### 环境说明
- 项目环境：Pycharm 2018（python 3语法）、MongoDB
- 数据库说明（在config.py中设置）：
	- NewWeibo：本地MongoDB数据库名，无账号密码登录
	- blogger_info：博主个人信息表
	- weibo_content：博主微博信息表
	- blogger_friend：博主好友信息表
	- user_id：爬虫需要爬取的id表，不用管