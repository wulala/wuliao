const helper = require('../../utils/helper.js')
const app = getApp()


Page({


  data: {
    page: 1,
    loading: true,
    isGet: false, // 是否正在加载数据
    tip: '',
    list: [],
    nomore: false,
  },

  async onLoad(opt) {
    this.setData({ tip: helper.tip() })
    this.getData()

  },

  async getData() {

    if (this.data.nomore) return console.log('暂无更多数据！')

    let { page, list } = this.data
    this.data.isGet = true
    const queryRead = await wx.cloud.callFunction({ name: 'getRead', data: { page } })
    const readData = queryRead.result
    console.log(readData, '获取到的数据')
    const handlerReadData = readData.data.map(item => {


      if (item.type == 'en') item['data'] = item.en[0]
      if (item.type == 'article') item['data'] = item.article[0]

      item['date'] = helper.formatTime(new Date(item.updatedAt))

      item['class_index'] = Math.floor(Math.random() * 8)
      return item
    })

    console.log(handlerReadData, '编辑过的数据')

    if (!handlerReadData.length) this.data.nomore = true

    this.setData({ loading: false, list: list.concat(handlerReadData) })
    this.data.page += 1
    this.data.isGet = false
  },

  onReachBottom() {
    console.log('我到底部了')
    if (!this.data.isGet) this.getData()
  },

  onShareAppMessage() {
  }

})