// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

  const wxContext = cloud.getWXContext()
  let data = {}
  let status = 1 
  let date = null

  if (wxContext.SOURCE == "wx_devtools") {
    date = new Date()
  } else {
    date = new Date(+new Date + 8 * 60 * 60 * 1000)
  }

  let year = date.getFullYear()
  let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()

  const queryToday = await db.collection('today').aggregate()
    .match({
      date: `${year}-${month}-${day}`,
    })
    .lookup({
      from: 'articledata',
      localField: 'articleId',
      foreignField: '_id',
      as: 'article',
    }).lookup({
      from: 'endata',
      localField: 'enId',
      foreignField: '_id',
      as: 'en',
    }).end()
  const todayData = queryToday.list
  console.log(todayData, '获取到的今日数据')

  if (todayData.length) {
    let _data = todayData[0]
    _data.article = _data.article.length ? _data.article[0] : {}
    _data.en = _data.en.length ? _data.en[0] : {}
    data = _data
  } else {
    status = 0
  }

  console.log(data, '最终数据')

  return {
    data, status, wxContext
  }






}