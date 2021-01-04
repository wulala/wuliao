// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  let { type } = event // 哪个页面分享的

  if (!type) type = 'article'

  const addPush = await db.collection('push').add({
    data: {
      openId: OPENID,
      type,
      createdAt: +new Date,
      updatedAt: +new Date
    }
  })
  console.log(addPush, '添加记录完成')
  return {
    data: addPush,
    status: 1
  }
}
