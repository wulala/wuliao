// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV, })

const db = cloud.database()
const $ = db.command.aggregate
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
    const queryToday = await cloud.callFunction({ name: 'getToday', })
    const todayData = queryToday.result.data
    console.log(todayData, '获取今日推送数据')

    const queryPushUser = await db.collection('push').aggregate()
        .group({
            _id: '$openId',
            type: $.push('$type'),
            pushId: $.push('$_id'),
        })
        .project({
            type: $.arrayElemAt(['$type', 0]),
            pushId: $.arrayElemAt(['$pushId', 0]),
        })
        .end()

    const pushUser = queryPushUser.list
    console.log(pushUser, '拿到用户openId & 对应的索引id')

    pushUser.forEach(async item => {
        const pushResult = await cloud.openapi.subscribeMessage.send({
            touser: item._id,
            templateId: 'F1qrRQEv9AcKMcmOq6WT60SqKG9NzuTh7yg6dd--H38',
            page: `pages/index/index?sharetype=${item.type}&id=${todayData[item.type]._id}`,
            data: {
                // 标题
                thing1: { value: `《${todayData[item.type].title}》`, },

                // 作者
                name2: { value: item.type === 'en' ? '今日美文' : todayData.article.author, },
            },
        })

        console.log(pushResult, '推送结果')
    })

    // 删除对应的数据
    const removePushIds = await db.collection('push').where({ _id: _.in(pushUser.map(item => item.pushId)), }).remove()

    const removeNum = removePushIds.stats.remove
    console.log(removeNum, '删除对应推送用户数量')

    return { status: 1, }
}