// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV, })

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const { id, } = event
    let data = {}
    const status = 1
    if (!id) {
        return {
            data: {},
            status: 0,
            msg: 'id不能为空',
        }
    }

    const queryEn = await db.collection('endata').doc(id).get()
    const enData = queryEn.data
    console.log(enData, '获取 en 数据成功')

    // 查询是否阅读过此文章
    const queryRead = await db.collection('read').where({
        openId: wxContext.OPENID,
        enId: id,
    }).get()

    const readData = queryRead.data

    if (readData.length) {
        data = {
            ...readData[0],
            en: enData,
        }

        console.log(data, '最终数据')
    } else {
        const addReadData = {
            openId: wxContext.OPENID,
            enId: enData._id,
            liked: false,
            type: 'en',
            createdAt: Number(new Date),
            updatedAt: Number(new Date),
        }

        const addRead = await db.collection('read').add({ data: addReadData, })

        console.log(addRead, '添加阅读记录成功')

        data = {
            ...addReadData,
            _id: addRead._id,
            en: enData,
        }

        console.log(data, '最终数据')
    }

    return {
        data,
        status,
    }
}