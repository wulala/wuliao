// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV, })

const db = cloud.database()

const index = async (event, context) => {
    const wxContext = cloud.getWXContext()
    let data = {}
    const status = 1
    let date = null

    if (wxContext.SOURCE === 'wx_devtools') {
        date = (new Date)
    } else {
        date = new Date(Number(new Date) + 8 * 60 * 60 * 1000)
    }

    const year = date.getFullYear()
    const month = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()

    const queryToday = await db.collection('today').aggregate()
        .match({ date: `${year}-${month}-${day}`, })
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
        const _data = todayData[0]
        _data.article = _data.article.length ? _data.article[0] : {}

        _data.en = _data.en.length ? _data.en[0] : {}

        data = _data
    } else {
        const res = await cloud.callFunction({ name: 'timerToday', })
        console.log(res, '重新获取结果')

        if (res.result.status === 1) {
            return index(event, context)
        }

        status = 0
    }

    console.log(data, '最终数据')

    return {
        data,
        status,
        wxContext,
    }
}

// 云函数入口函数
exports.main = index