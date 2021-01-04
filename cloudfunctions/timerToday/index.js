// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

  const wxContext = cloud.getWXContext()

  console.log(wxContext, '环境')

  let date = null
  let data = null

  if (wxContext.SOURCE == "wx_devtools") {
    date = new Date()
  } else {
    date = new Date(+new Date + 8 * 60 * 60 * 1000)
  }

  let year = date.getFullYear()
  let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()

  // 获取今日数据
  const queryToday = await db.collection('today').count()
  const todayNum = queryToday.total
  console.log(todayNum, '已经加入的天数')

  const queryArticle = await db.collection('articledata').skip(todayNum).limit(1).get()
  const articleData = queryArticle.data
  console.log(articleData, '获取文章数据')

  const queryEn = await db.collection('endata').skip(todayNum).limit(1).get()
  const enData = queryEn.data
  data = {
    articleId: articleData[0]._id,
    enId: enData[0]._id,
    date: `${year}-${month}-${day}`,
    createdAt: +new Date,
    updatedAt: +new Date,
  }
  console.log(data, '最终数据')

  const addData = await db.collection('today').add({ data })
  console.log(addData, '插入数据库成功')
  return {
    data,
    status: 1,
  }
}