Page({

  /**
   * 页面的初始数据
   */
  data: {
    _id:{},
    Transaction_status:{},
    queryResult: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      _id: options._id,
      Transaction_status: options.Transaction_status
    }) 
    const db = wx.cloud.database()
    db.collection('goods').doc(this.data._id)
    .get({
      success: res => {
        console.log(res.data)
        this.setData({
          queryResult: res.data,
        })
      }
    })
    console.log(this.data._id)
    console.log(this.data.Transaction_status)
  },

  dealClose: function(){
    wx.showModal({
      title: '提示',
      content: '确定交易成功吗？',
      success: res => {
        if(res.confirm){
          console.log('用户点击确定')
          const db = wx.cloud.database()
          db.collection('goods').doc(this.data._id)
          .update({
            data: {
              Transaction_status: "1"
            },
            success: res => {
              console.log("交易成功")
            },
            fail: err => {
              console.log("交易失败")
            }
          })
          wx.reLaunch({
            url: '../mine/mine',
          })
        }else if(res.cancel){
          console.log('用户点击取消')
        }
      }
    })
  },

  // 点击轮播图进行放大预览
  handlePriview(e) {
    // 1 先构造要预览的图片数组
    const urls = this.data.queryResult.img;
    // 2 接受传递过来的图片url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this
    return {
      title: that.data.userInfo.nickName + "分享了" + that.data.queryResult.goods_name + "给你哦~",
      imageUrl: that.data.queryResult.img[0],
      success: res => {
        wx.showToast({
          title: '转发成功'
        })
        console.log(res, "转发成功")
      },
      fail: res => {
        wx.showToast({
          icon: 'none',
          title: '转发失败'
        })
        console.log(res, "转发失败")
      }
    }
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