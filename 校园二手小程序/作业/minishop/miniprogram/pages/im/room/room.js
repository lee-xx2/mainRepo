const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: null,
    logged: false,
    takeSession: false,
    requestResult: '',
    chatRoomEnvId: 'barry-0l96x',
    chatRoomCollection: 'chatroom',  //存放聊天记录
    chatRoomGroupId: '',  //唯一定义聊天小组，id+id组成独一无二的聊天室
    chatRoomGroupName: '',  //聊天窗口显示名称

    // functions for used in chatroom components
    onGetUserInfo: null,
    getOpenID: null,
  },

  onLoad: function(opt) {
    this.setData({
      chatRoomGroupId: opt.id,
      chatRoomGroupName: opt.name
    })
    wx.setNavigationBarTitle({
      title: opt.name
    })


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

    this.setData({
      onGetUserInfo: this.onGetUserInfo,
      getOpenID: this.getOpenID,
    })

    wx.getSystemInfo({
      success: res => {
        console.log('system info', res)
        if (res.safeArea) {
          const { top, bottom } = res.safeArea
          this.setData({
            containerStyle: `padding-top: ${(/ios/i.test(res.system) ? 1 : 2) + top}px; padding-bottom: ${40 + res.windowHeight - bottom}px`,
          })
        }
      },
    })
  },

  getOpenID: async function() {
    if (this.openid) {
      return this.openid
    }

    const { result } = await wx.cloud.callFunction({
      name: 'chat_demo1',
      data:{
        $url: 'openid'
      }
    })
    //云路由已经返回openid为result

    return result
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  //分享页面
  onShareAppMessage() {
    return {
      title: '聊天',
      path: '/pages/im/room/room',
    }
  },
})
