// miniprogram/pages/news/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        lastTapTime: 0,
        data: [],
        popData: {},
        popTime: '',
        pop: false,
        adddbclick: true,
        timer: null,
    },

    nothing() {

    },

    dbclick() {

        console.log(this.data.lastTapTime, 111)
        if (this.data.lastTapTime == 0) {
            return this.data.lastTapTime = +new Date
        }

        const curTime = +new Date
        console.log(this.data.lastTapTime, 222)
        if (curTime - this.data.lastTapTime <= 300) {
            this.closePop()
            this.data.lastTapTime = 0
        } else {
            this.data.lastTapTime = curTime
        }

    },

    addHide() {
        wx.setStorageSync('dbclick', 'false')
        this.setData({
            adddbclick: false
        })
    },

    showPop(e) {
        /**
         * time = 时间
         */
        const { id, time } = e.currentTarget.dataset
        const getClickData = this.data.data[time].data.find(item => item.id == id)
        const getClickDataTime = this.data.data[time].dateStr.substr(3)
        getClickData.visited = true

        this.setData({
            data: this.data.data,
            popData: getClickData,
            popTime: getClickDataTime,
            pop: true,
        })
    },
    closePop() {
        this.setData({
            pop: false,
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {

        const _dbclick = (wx.getStorageSync('dbclick')).trim()
        console.log('双击关闭', _dbclick)

        if (_dbclick == 'false') {
            this.setData({ adddbclick: false })
        } else {
            this.data.timer = setTimeout(() => this.setData({ adddbclick: false }), 10000)
        }

        const queryToday = await wx.cloud.callFunction({ name: 'getSolidot' })
        const solidotData = queryToday.result
        console.log(solidotData, '获取到 -科技资讯- 数据')
        this.setData({
            data: solidotData.data
        })

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})