// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const page = event.page
  const MAX_LIMIT = 7

  // const queryRead = await db.collection('read').skip((page - 1) * MAX_LIMIT).limit(MAX_LIMIT).get()

  const queryRead = await db.collection('read').aggregate()
    .match({
      openId: wxContext.OPENID,
    })
    .sort({'updatedAt': -1})
    .lookup({
      from: 'articledata',
      localField: 'articleId',
      foreignField: '_id',
      as: 'article',
    })
    .lookup({
      from: 'endata',
      localField: 'enId',
      foreignField: '_id',
      as: 'en',
    }).skip((page - 1) * MAX_LIMIT).limit(MAX_LIMIT).end()

  let readDataList = queryRead.list


  console.log(readDataList, '我是连表查询第' + page + '页数据')

  return {
    data: readDataList,
    status: 1
  }

}