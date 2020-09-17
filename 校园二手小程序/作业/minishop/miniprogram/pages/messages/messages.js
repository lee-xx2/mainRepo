// pages/messages/messages.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    

  },

 



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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

    if (app.globalData.userInfo){
      this.setData({
        openid: app.globalData.openid,
        userInfo: app.globalData.userInfo,
        friends: app.globalData.friends,//在开始聊天的时候更新赋值

      });

    }else{
      wx.showToast({
        title: '必须先登录',
        duration: 5000,
        success: function () {
          
          setTimeout(function () {
            //要延时执行的代码
            wx.navigateTo({
              url: '../mine/mine',
            })
          }, 2000) //延迟时间
        }
      })
    }
    console.log('show_friends', this.data.friends);
   


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