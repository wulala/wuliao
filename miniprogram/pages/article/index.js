const helper = require('../../utils/helper.js')
const app = getApp()

Page({

  data: {
    loading: true,
    tip: '', // 加载中的鸡汤 
    article: {}, // 文章相关数据
    timer: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(opt) {

    console.log(opt, '文章 opt 参数')

    this.data.id = opt.id
    this.setData({ tip: helper.tip() })
    this.getData()
  },

  async getData() {
    const queryArticle = await wx.cloud.callFunction({
      name: 'getArticle', data: {
        id: this.data.id
      }
    })
    const articleData = queryArticle.result
    console.log(articleData, '获取到的数据')
    this.setData({ loading: false, article: articleData.data })
  },

  async changeLike() {

    const { _id, liked } = this.data.article
    const queryRead = await wx.cloud.callFunction({
      name: 'setLike', data: { id: _id, liked: !liked }
    })
    const ReadData = queryRead.result
    console.log(ReadData, '切换收藏状态成功')

    this.data.article.liked = !liked
    this.setData({
      article: this.data.article
    })
  },

  intoHome() {
    wx.reLaunch({ url: '/pages/article/index' })
  },

  more() {
    if (this.data.readId) {
      wx.navigateBack()
    } else {
      wx.navigateTo({ url: '/pages/read/index' })
    }
  },

  onHide() {

  },

  async push() {
    wx.requestSubscribeMessage({
      tmplIds: ['F1qrRQEv9AcKMcmOq6WT60SqKG9NzuTh7yg6dd--H38'],
      success: async (res) => {
        console.log(res, res['F1qrRQEv9AcKMcmOq6WT60SqKG9NzuTh7yg6dd--H38'], '下发模板消息授权成功')
        if (res['F1qrRQEv9AcKMcmOq6WT60SqKG9NzuTh7yg6dd--H38'] == 'accept') {
          console.log('我是同意授权咯')
          const addPush = await wx.cloud.callFunction({
            name: 'setPush', data: {
              type: 'article'
            }
          })
        }
      }
    })
  },

  onShareAppMessage() {

    let { article } = this.data.article

    console.log('wenzhangfenxiangid', article, article._id)

    return {
      title: `《${article.title}》${article.author}`,
      path: 'pages/index/index?sharetype=article&id=' + article._id
    }
  }
})