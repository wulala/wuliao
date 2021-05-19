// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV, })

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    console.log(wxContext, '环境')

    let date = null
    let data = null

    if (wxContext.SOURCE === 'wx_devtools') {
        date = (new Date)
    } else {
        date = new Date(Number(new Date) + 8 * 60 * 60 * 1000)
    }

    const year = date.getFullYear()
    const month = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()

    // 获取今日数据
    const queryToday = await db.collection('today').count()
    const todayNum = queryToday.total
    console.log(todayNum, '已经加入的天数')

    const queryArticle = await db.collection('articledata').skip(todayNum).limit(1).get()
    const articleData = queryArticle.data
    console.log(articleData, '获取文章数据')

    const queryEn = await db.collection('endata').where({ date: `${year}-${month}-${day}`, }).get()
    const enData = queryEn.data
    console.log(enData, '获取的英语数据', await db.collection('endata').count(), '英语数量')

    if (!enData.length) {
        const res = await cloud.callFunction({ name: 'timerEn', })
        console.log(res.result, '重新获取英语结果')

        enData = [res.result.data]
    }

    data = {
        articleId: articleData[0]._id,
        enId: enData[0]._id,
        date: `${year}-${month}-${day}`,
        createdAt: Number(new Date),
        updatedAt: Number(new Date),
    }

    console.log(data, '最终数据')

    const delToday = await db.collection('today').where({ date: `${year}-${month}-${day}`, }).remove()

    const addData = await db.collection('today').add({ data, })

    console.log(addData, '插入数据库成功')

    return {
        data,
        status: 1,
    }
}