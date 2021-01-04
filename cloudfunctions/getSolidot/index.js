// 云函数入口文件
const cloud = require('wx-server-sdk')
const util = require('./helper')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    let date = new Date()
    if (wxContext.SOURCE != "wx_devtools") {
        date = new Date(+new Date + 8 * 60 * 60 * 1000)
    }
    const days = util.getTYB(date)
    console.log(days, '日期')

    let data = []

    const dayCN = ['今天', '昨天', '前天']

    for (let index = 0; index < days.length; index++) {
        const day = days[index]

        const dayDataResult = await db.collection('solidotdata').where({
            date: day,
        }).get()

        let dayData = dayDataResult.data[0]

        console.log(dayData, '!!!')

        dayData.dateStr = dayData.date.replace(/([\d]{4})([\d]{2})([\d]{2})/, (all, one, two, three) => `${dayCN[index]}、 ${one}年${two}月${three}日`)

        data.push(dayData)
    }





    return {
        // event,
        // openid: wxContext.OPENID,
        // appid: wxContext.APPID,
        // unionid: wxContext.UNIONID,
        status: 1,
        data
    }
}