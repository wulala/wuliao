// 云函数入口文件
const cloud = require('wx-server-sdk')
const util = require('./helper')
const fetch = require('node-fetch')
const cheerio = require('cheerio')
const he = require('he')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

    const wxContext = cloud.getWXContext()

    let date = new Date()
    if (wxContext.SOURCE != "wx_devtools") {
        date = new Date(+new Date + 8 * 60 * 60 * 1000)
    }

    console.log(date, '当前日期（东八区）')

    const days = util.getTYB(date)

    console.log(days, '日期')
    for (let index = 0; index < days.length; index++) {
        const day = days[index];
        const dayData = await getDATA(day)

        const data = {
            date: day,
            data: dayData,
            updateAt: +new Date
        }

        const hasDayData = await db.collection('solidotdata').where({
            date: day,
        }).get()

        if (hasDayData.data.length) {

            const updateData = await db.collection('solidotdata').doc(hasDayData.data[0]['_id']).set({
                data: {
                    ...data
                }
            })
            console.log('更新数据库成功', updateData)

        } else {
            const addData = await db.collection('solidotdata').add({
                data: {
                    ...data
                }
            })
            console.log('插入数据库成功', addData)
        }
    }

    return {
        status: 1
    }
}

async function getDATA(time) {
    const response = await fetch('https://www.solidot.org/?issue=' + time)
    const body = await response.text()
    const $ = cheerio.load(body)
    let items = []
    $('.block_m').each((index, item) => {
        const id = $(item).find('.ct_tittle h2 > a').attr('href').match(/\d+/ig)[0]
        const title = $(item).find('.ct_tittle h2 > a').text().replace(/\s+/ig, '')
        const includeTime = $(item).find('.talk_time').text()
        const regTime = includeTime.match(/发表于.*/ig)[0]
        const time = regTime.split(' ')[1]
        // https://ourcodeworld.com/articles/read/188/encode-and-decode-html-entities-using-pure-javascript
        const intro = he.decode($(item).find('.p_mainnew').text().replace(/\s+/ig, ''))
        items.push({
            id,
            title,
            time,
            intro,
        })

    })
    return items
}