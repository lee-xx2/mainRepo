//index.js
const app = getApp()

Page({
  data: {
    swiperList: [{
      image_src: "cloud://barry-0l96x.6261-barry-0l96x-1301443914/pic/show2.png"
    },
    {
      image_src: "cloud://barry-0l96x.6261-barry-0l96x-1301443914/pic/show1.png"
    },
    {
      image_src: "cloud://barry-0l96x.6261-barry-0l96x-1301443914/pic/show.png"
    }
    ],
    current: 0,
    swiper: 0,
    title: ["推荐", "书籍", "美妆", "服饰", "食品", "生活用品", "电子产品", "其他"],
    font: ["bold", "normal", "normal", "normal", "normal", "normal", "normal", "normal"],
    array: [],
    clientHeight: 0,
    shownum: 3
  },

  onLoad: function() {
    this.swiperheight();
    this.initData();


    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'chat_demo1',
      data: {
        $url: "openid"
      },
      success: res => {
        console.log('[云函数] [login] user openid: ', res)
        app.globalData.openid = res.result
        console.log(app)
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        
      }
    })
  },
  // 进入首页显示推荐部分的商品
  initData: function () {
    var that = this;
    wx.cloud.callFunction({
      name: 'initdata',
      data: {},
      success: function (res) {
        console.log(res)
        that.setData({
          array: []
        });
        that.setData({
          array: that.data.array.concat(res.result.list).reverse()
        });
      },
    })
  },


  more: function () {
    this.setData({
      shownum: this.data.shownum + 3
    })
  },

  // 滑动时商品显示函数
  swiperchange: function (e) {
    var that = this;
    var current = e.detail.current;
    var title = that.data.title;
    that.setData({
      current: current
    })
    if (current != 0) {
      wx.cloud.callFunction({
        name: 'showgoods',
        data: {
          a: title[current]
        },
        success(res) {
          that.setData({
            array: []
          });
          that.setData({
            array: that.data.array.concat(res.result.list).reverse()
          });
        },
      })
    } else {
      that.setData({
        array: []
      });
      that.initData();
    }

  },


  // 点击时商品显示函数
  titletap: function (e) {
    var that = this;
    var ee = e.currentTarget.dataset.name
    var i;
    for (i = 0; i < 10; i++) {
      if (this.data.title[i] == e.currentTarget.dataset.name) {
        break;
      }
    }
    this.setData({
      swiper: i
    })
    if ("推荐" != ee) {
      wx.cloud.callFunction({
        name: 'showgoods',
        data: {
          a: ee
        },
        success(res) {
          that.setData({
            array: []
          });
          that.setData({
            array: that.data.array.concat(res.result.list).reverse()
          });
        },
      })
    }
    else {
      that.setData({
        array: []
      });
      that.initData();
    }
  },

  // 设置swiper自适应高度
  swiperheight: function () {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight
        });
      }
    });
  },

  

 

})
