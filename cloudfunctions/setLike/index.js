// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const id = event.id
  const liked = event.liked

  if (!id) return { data: {}, msg: 'id不能为空', status: 0 }
  const updateRead = await db.collection('read').doc(id).update({
    data: { liked }
  })
  const updateData = updateRead.data
  console.log(updateData, '获取文章数据')
  return {
    data: updateData,
    status: 1
  }
}