const fs = require('fs-extra')
const bent = require('bent')
const getJSON = bent('json')
const atob = require('atob');

// 目前数据库 人工手动采集 2017-01-01到2020-08-15日 的数据

// 文章数据API地址
const BASEURL = atob('aHR0cHM6Ly9yaWtlLWFwaS5tb3JlbGVzcy5pby92MS9sZXNzb25z')
const API = BASEURL + '?from=2020-08-01&to=2020-08-15' // 自己去修改时间哦。最早的数据是2017-01-01


async function init() {

    const data = await getJSON(API)
    const file = './handle_result.json'
    data.forEach(item => { // 处理成我需要的数据。
        let date = +new Date
        let data = {
            title: item.provenance,
            author: item.author.name,
            content: item.article,
            createdAt: date,
            updatedAt: date,
        }
        fs.outputFileSync(file, JSON.stringify(data), {
            flag: 'a'
        })
    })
}

init()