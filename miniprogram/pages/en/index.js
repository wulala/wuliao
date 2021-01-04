const helper = require('../../utils/helper.js')
const app = getApp()



Page({
  data: {
    tip: '',
    loading: true,
    play_class: 'mp3',
    en: {},
    innerAudioContext: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(opt) {

    this.data.id = opt.id

    this.data.innerAudioContext = wx.createInnerAudioContext()

    this.data.innerAudioContext.onPlay(() => {
      console.log('开始播放')
      this.setData({
        play_class: 'mp3ed'
      })

    })
    this.data.innerAudioContext.onEnded(() => {
      console.log('播放结束')
      this.setData({
        play_class: 'mp3'
      })
    })

    this.setData({ tip: helper.tip() })
    this.getData()
  },

  async getData() {
    const queryEn = await wx.cloud.callFunction({
      name: 'getEn', data: {
        id: this.data.id
      }
    })
    const enData = queryEn.result
    console.log(enData, '获取每日英语成功')
    this.setData({ loading: false, en: enData.data })
    this.data.innerAudioContext.src = enData.data.en.mp3
  },

  async changeLike() {
    const { _id, liked } = this.data.en
    const queryRead = await wx.cloud.callFunction({
      name: 'setLike', data: { id: _id, liked: !liked }
    })
    const ReadData = queryRead.result
    console.log(ReadData, '切换收藏状态成功')

    this.data.en.liked = !liked
    this.setData({
      en: this.data.en
    })
  },

  mp3() {
    this.data.innerAudioContext.play()
  },

  download() {
    wx.downloadFile({
      url: this.data.en.en.pic,
      success(res) {
        if (res.statusCode === 200) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success() {
              wx.showToast({
                title: '保存图片成功',
                icon: 'success',
                duration: 3000
              })
            }
          })
        }
      }
    })
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
              type: 'en'
            }
          })
        }
      }
    })
  },



  onUnload() {
    console.log('销毁')
    this.data.innerAudioContext.destroy()
  },


  onShareAppMessage() {
    const { en } = this.data.en
    console.log(en, 'fenxaign')
    return {
      title: en.content,
      path: 'pages/index/index?sharetype=en&id=' + en._id,
      imageUrl: en.pic
    }
  }
})