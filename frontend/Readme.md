
## 开发
```
cnpm install
npm start
```
## 说明
- localhost:8000/api ---proxy---> localhost:8001

## 添加一个页面
在pages下赋值EchartsExample，重命名，然后添加到routerConfig

## API文档

- GET /api/bloggers 获取所有博主
- GET /api/bloggers/:name 获取单个博主（按姓名）的基本信息