## 无聊主义lite

### 文件夹相关

- cloudfunctions文件夹 => `get***`为get请求数据，`set***`为写数据库操作，`timer***`为定时任务（记得上传触发器）

- database文件夹 => 数据库

- node文件夹 => 手动获取文章数据

- miniprogram文件夹 => 小程序页面

### 云开发相关

##### 数据库
手动创建两个集合： `articledata`和`endata`，然后导入`database`文件夹内对应的数据。

##### 妙
- 未登录状态： 从朋友圈进入的
- 其他时候天然登录

##### 坑
云函数使用的是标准时间！一定要注意它！ 因为mongo中的date类型以UTC（Coordinated Universal Time）存储，就等于GMT（格林尼治标准时）时间。而系统时间使用的是GMT+0800时间，两者正好相差8个小时。

---

![无聊主义lite](https://user-images.githubusercontent.com/2832873/103495229-06f82d00-4e75-11eb-974b-b2331e7d911f.jpg)

---

### 数据来源于网络，如有侵权请联系删除。

### LICENSE
Dual-licensed MIT and Apache-2.0