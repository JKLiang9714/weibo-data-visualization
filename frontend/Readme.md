
## 开发
```
cnpm install
npm start
```
## 说明
```
.
├── BloggerDistribution
│   └── index.js # 博主整体分布图（男女比例）
├── bloggers
│   ├── Components # 博主个人可视化
│   │   ├── BasicInfo.js # 基本信息
│   │   ├── FriendsTopology.js # 朋友拓扑图
│   │   ├── Popularity.js # 近50条微博热度
│   │   ├── WeiboNum.js # 三个月发微博次数趋势图
│   │   ├── WeiboPublishTime.js # 50条微博发布时间
│   │   └── WordCloud.js # 50条微博词云
│   └── $name.js
├── HeatMap
│   └── index.js # 地域分布热力图
├── index.css
└── index.js
```

## 添加一个页面
在pages下赋值EchartsExample，重命名，然后添加到menuConfig

## API文档

- GET /api/bloggers 获取所有博主
- GET /api/bloggers/:name 获取单个博主（按姓名）的基本信息
- GET /api/blogger/:name/friends 获取博主朋友列表
- GET /api/blogger/:name/weiboContent 获取博主微博列表
