![无聊主义lite](https://user-images.githubusercontent.com/2832873/103495229-06f82d00-4e75-11eb-974b-b2331e7d911f.jpg) 看美文，学英语，尽在无聊主义lite。

------

无聊主义是基于`云开发`的一款开源微信小程序。 
## 目录结构

``` yaml
/cloudfunctions # 云函数列表
    getArticle/ # 获取文章详情

/miniprogram # 小程序前端功能
    components/ # 公共组件
        tip/ # 加载提示语
    pages/ # 展示页面
        index/ # 首页
        en/ # 每日英语详情页
        article/ # 文章详情页
        read/ # 我的页面 - (阅读记录) 

/node # 获取文章数据
    getArticle.js # 注意！不是输出JSON格式数据哦。输出的是符合云开发数据库导入需要的格式

```

`index/read`页面元素采用`新拟物风格Neumorphism`(其实就是没设计，安慰自己的)。

云开发除了从朋友圈进来的，其他时刻都是`天然登录鉴权`，只需编写自身业务逻辑代码。

云函数环境使用的是标准时间！因此你在云函数中`通过new Date获取到的时间会比实际的少8个小时`。



### 特别说明
> 数据来源于网络，如有侵权请联系删除。

### LICENSE
Dual-licensed MIT and Apache-2.0