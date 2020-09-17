// pages/signUp/signUp.js

const db = wx.cloud.database();
const app = getApp();
// const config = require("../../style/config.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // userInfo: '',
    ids: -1,
    nickName: '',
    school: '' ,
    major: '' ,
    wxNumber: '' ,
    phone: '' ,
    avatarUrl: '' ,
    gender: '' ,
    schoolArea: [
      {
        "name": "龙洞校区",
        "id": 0
      },
      {
        "name": "大学城校区",
        "id": 1
      },
      {
        "name": "东风路校区",
        "id": 2
      },
      {
        "name": "番禺校区",
        "id": 3
      }
    ]

  },

  choose(e) {
    let that = this;
    that.setData({
      ids: e.detail.value
    })
    //下面这种办法无法修改页面数据
    /* this.data.ids = e.detail.value;*/
  },
  phoneInput(e) {
    this.data.phone = e.detail.value;
  },
  majorInput(e) {
    this.data.major = e.detail.value;
  },
  wxInput(e) {
    this.data.wxNumber = e.detail.value;
  },
  schoolInput(e) {
    this.data.school = e.detail.value;
  },
  getUserInfo(e) {
    let that = this;
    console.log('userInfoMsg')
    console.log(e);
    let test = e.detail.errMsg.indexOf("ok");
    if (test == '-1') {
      wx.showToast({
        title: '请授权后方可使用',
        icon: 'none',
        duration: 2000
      });
    } else {

      that.setData({
        userInfo: e.detail.userInfo,
        // gender: that.data.userInfo.gender
      });

      wx.showLoading({
          title: '正在提交',
        });
      
        wx.cloud.callFunction({
          name: 'chat_demo1',
          data: {
            $url: "login", //云函数路由参数
            phone: that.data.phone,
            school: that.data.school,
            schoolArea: that.data.schoolArea[that.data.ids],
            major: that.data.major,
            wxNumber: that.data.wxNumber,
            stamp: new Date(),  //注册日期
            userInfo: that.data.userInfo,
            
          },
          success: res => {
            console.log('down')
            console.log(res)
            console.log('up')
            app.globalData.userInfo = that.data.userInfo
            app.globalData.openid = res.result.data.OPENID
            console.log(app.globalData.userInfo)
            console.log(app.globalData.openid)
            wx.navigateBack({
              //回到之前一页

            })
          },
          fail() {
            wx.hideLoading();
            wx.showToast({
              title: '注册失败，请重新提交',
              icon: 'none',
            })
          }
        });


    }
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