const app = getApp()

Page({
  data: {
    userInfo:{},
    user_id:{},
    nickName:{},
    avatarUrl:{},
    gender:'',
    tabs: [
      {
        id: 0,
        value: "已发布",
        isActive: true
      },
      {
        id: 1,
        value: "已交易",
        isActive: false
      }
    ],
    publishedList: [],
    tradedList: [],
  },

  handleGetUserInfo(e){
    console.log(e);
    const {userInfo} = e.detail;
    wx.setStorageSync("userInfo", userInfo);
    wx.reLaunch({
      url: 'mine',
    })
  },
  handleItemTap(e){
    const {index} = e.currentTarget.dataset;
    let {tabs} = this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    })
  },

  scanCode: function () {
    var page = this;
    wx.scanCode({
      success: function (res) {
        page.setData({
          resCode: res
        })
      }
    })
  },

  onLoad: function (options) {
    
  },

  onReady: function () {
    
  },

  onShow: function () {
    wx.cloud.callFunction({
      name: 'login',
      success: res => {
        app.globalData.openid = res.result.openid,
        this.setData({
          user_id: res.result.openid
        })

        wx.getUserInfo({
          success: res => {
            console.log('this is my userInfo:',res.userInfo)
            if (res.userInfo.gender == 1){
              this.setData({
                gender: "男"
              })
            }
            else if (res.userInfo.gender == 2) {
              this.setData({
                gender: "女"
              })
            }
            this.setData({
              userInfo: res.userInfo,
              nickName: res.userInfo.nickName,
              avatarUrl: res.userInfo.avatarUrl,
            })

            app.globalData.userInfo = res.userInfo
            
            const db = wx.cloud.database()
            db.collection('goods').where({
              _openid: this.data.user_id,
              Transaction_status: "0"
            })
            .get({
              success: res => {
                console.log('查询商品表-未交易',res.data)
                this.setData({
                  publishedList: res.data,
                })
              }
            })
            db.collection('goods').where({
              _openid: this.data.user_id,
              Transaction_status: "1"
            })
            .get({
              success: res => {
                console.log('查询商品表-已交易',res.data)
                this.setData({
                  tradedList: res.data
                })
              }
            })

            //查询—id

            db.collection('user').doc(this.data.user_id)
            .get()
            .then(res => {
              console.log("该用户信息已存在")
            })
            .catch(err => {
              db.collection('user').add({
                data: {
                  _id: this.data.user_id,
                  nickName: this.data.nickName,
                  avatarUrl: this.data.avatarUrl,
                  gender: this.data.gender,
                  friends: [],
                  phone:'',
                  wxNumber: '',
                  school: '',
                  schoolArea: '',
                  major: '',
                  stamp: new Date(),
                }
              })
              .then(res => {
                console.log("插入用户信息成功")
              })
              .catch(err => {
                console.log("插入用户信息失败")
              })
            })
          }
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },

  onHide: function () {
    
  },

  onUnload: function () {
    
  },

  onPullDownRefresh: function () {
    
  },

  onReachBottom: function () {
    
  },

})