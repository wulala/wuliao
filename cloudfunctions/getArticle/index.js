// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const id = event.id
  let data = {} 

  if (!id) return { data: {}, status: 0 }

  const queryArticle = await db.collection('articledata').doc(id).get()
  const articleData = queryArticle.data
  console.log(articleData, '获取文章数据')

  // 查询是否阅读过此文章
  const queryRead = await db.collection('read').where({
    openId: wxContext.OPENID,
    articleId: id,
  }).get()
  const readData = queryRead.data

  if (readData.length) {
    data = Object.assign({}, readData[0], { article: articleData })
    console.log(data, '最终数据')
  } else {

    let addReadData = {
      openId: wxContext.OPENID,
      articleId: articleData._id,
      liked: false,
      type: 'article',
      createdAt: +new Date,
      updatedAt: +new Date,
    }
    const addRead = await db.collection('read').add({
      data: addReadData
    })
    console.log(addRead, '添加阅读记录成功')

    data = Object.assign({}, addReadData, { _id: addRead._id, article: articleData })
    console.log(data, '最终数据')
  }

  return {
    data: data,
    status: 1
  }
}