// 云函数入口文件
const cloud = require('wx-server-sdk')
const bent = require('bent')
const getJSON = bent('json')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV, })

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    // todo: 获取失败了怎么办

    // http://open.iciba.com/dsapi/?date=2019-11-15  // 这个时间点开始有分享图片
    // http://open.iciba.com/dsapi/?date=2018-01-01// 数据从2018-01-01开始
    // 访问背景： http://cdn.iciba.com/news/word/[api.picture4]
    // 访问语音： http://news.iciba.com/admin/tts/[api.tts]

    const data = await getJSON('http://open.iciba.com/dsapi/')
    console.log('获取数据成功', data)

    const date = Number(new Date)
    const newData = {
        title: data.note,
        content: data.content,
        date: data.dateline,
        pic: data.fenxiang_img,
        mp3: data.tts,
        createdAt: date,
        updatedAt: date,
    }

    const addData = null
    const hasData = await db.collection('endata').where({ date: data.dateline, }).get()
    if (!hasData.data.length) {
        await db.collection('endata').add({ data: newData, })
    }

    console.log('插入数据库成功', addData, hasData.data, '已有数据')

    return {
        data,
        status: 1,
    }
}