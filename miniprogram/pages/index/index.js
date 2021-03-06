Page({

    data: {
        addtip: true,
        loading: true,
        today: {},
        timer: null,
    },

    onLoad(opt) {
        console.log(opt, '接收到的参数')

        if (opt.sharetype) {
            wx.navigateTo({ url: `/pages/${opt.sharetype}/index?id=${opt.id}`, })
        }

        const _add = (wx.getStorageSync('hide')).trim()
        console.log('加入小程序提示', _add)

        if (_add === 'hide') {
            this.setData({ addtip: false, })
        } else {
            this.data.timer = setTimeout(() => this.setData({ addtip: false, }), 10000)
        }

        this.getTodayData()
    },

    async getTodayData() {
        const queryToday = await wx.cloud.callFunction({ name: 'getToday', })

        const todayData = queryToday.result
        console.log(todayData, '获取到 -首页- 数据')

        this.setData({
            loading: false,
            today: todayData.data,
        })
    },

    addHide() {
        wx.setStorageSync('hide', 'hide')

        this.setData({ addtip: false, })
    },

    onHide() {
        if (this.data.timer) {
            this.setData({ addtip: false, })

            clearTimeout(this.data.timer)
        }
    },

    // eslint-disable-next-line no-empty-function
    onShareAppMessage() { },
})