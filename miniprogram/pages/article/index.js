Page({
    data: {
        loading: true,
        // 文章相关数据
        article: {},
        timer: null,
    },

    onLoad(opt) {
        console.log(opt, '文章 opt 参数')

        this.data.id = opt.id

        this.getData()
    },

    async getData() {
        const queryArticle = await wx.cloud.callFunction({
            name: 'getArticle',
            data: { id: this.data.id, },
        })

        const articleData = queryArticle.result
        console.log(articleData, '获取到的数据')

        this.setData({
            loading: false,
            article: articleData.data,
        })
    },

    async changeLike() {
        const { _id, liked, } = this.data.article
        const queryRead = await wx.cloud.callFunction({
            name: 'setLike',
            data: {
                id: _id,
                liked: !liked,
            },
        })

        const ReadData = queryRead.result
        console.log(ReadData, '切换收藏状态成功')

        this.data.article.liked = !liked

        this.setData({ article: this.data.article, })
    },

    intoHome() {
        wx.reLaunch({ url: '/pages/article/index', })
    },

    more() {
        if (this.data.readId) {
            wx.navigateBack()
        } else {
            wx.navigateTo({ url: '/pages/read/index', })
        }
    },

    push() {
        wx.requestSubscribeMessage({
            tmplIds: ['F1qrRQEv9AcKMcmOq6WT60SqKG9NzuTh7yg6dd--H38'],
            success: async res => {
                if (res['F1qrRQEv9AcKMcmOq6WT60SqKG9NzuTh7yg6dd--H38'] === 'accept') {
                    console.log('我是同意授权咯')

                    const addPush = await wx.cloud.callFunction({
                        name: 'setPush',
                        data: { type: 'article', },
                    })
                }
            },
        })
    },

    onShareAppMessage() {
        const { article, } = this.data.article
        return {
            title: `《${article.title}》${article.author}`,
            path: `pages/index/index?sharetype=article&id=${article._id}`,
        }
    },
})