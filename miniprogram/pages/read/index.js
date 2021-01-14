const helper = require('../../utils/helper.js')

Page({

    data: {
        page: 1,
        loading: true,

        // 是否正在加载数据
        isGet: false,
        tip: '',
        list: [],
        nomore: false,
    },

    onLoad() {
        this.getData()
    },

    async getData() {
        if (this.data.nomore) {
            return console.log('暂无更多数据！')
        }

        const { page, list, } = this.data
        this.data.isGet = true

        const queryRead = await wx.cloud.callFunction({
            name: 'getRead',
            data: { page, },
        })

        const readData = queryRead.result
        console.log(readData, '获取到的数据')

        const handlerReadData = readData.data.map(item => {
            if (item.type === 'en') {
                // eslint-disable-next-line prefer-destructuring
                item.data = item.en[0]
            }

            if (item.type === 'article') {
                // eslint-disable-next-line prefer-destructuring
                item.data = item.article[0]
            }

            item.date = helper.formatTime(new Date(item.updatedAt))

            // eslint-disable-next-line camelcase
            item.class_index = Math.floor(Math.random() * 8)

            return item
        })

        console.log(handlerReadData, '编辑过的数据')

        if (!handlerReadData.length) {
            this.data.nomore = true
        }

        this.setData({
            loading: false,
            list: list.concat(handlerReadData),
        })

        this.data.page += 1

        this.data.isGet = false

        return true
    },

    onReachBottom() {
        console.log('我到底部了')

        if (!this.data.isGet) {
            this.getData()
        }
    },

    // eslint-disable-next-line no-empty-function
    onShareAppMessage() { },

})