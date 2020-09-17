const app = getApp()

Page({
  data: {
    friends: [],
    thatOpenid: '',
    //oNEJX43WXK1CuA1MMXY_fTaHPlWs
    //oNEJX45J685b2NzNzzumM9nMt4K4
    thatNickName: '',
    thatAvatar: '',
    //https://wx.qlogo.cn/mmopen/vi_32/SsqYMXV1SlIe8fDjc2B3YEiaibAJsg50Re9ba3jvrt1N4FvYicjnTSMoALibHGKQUQejbdJZ5XNTTPwlJ4DtmYnBKg/132
    //https://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83erl67SY6LJtL0EvEkJ7XkaTdkNicDPqCREcr1dEtK2GssnibBfUVicGxGF4GHictTibKamib1hv8vppYN1Q/132
    //SerDavil，海阔天空
    isFriend: 0,
    room: ''
  },

  onLoad: function (opt) {
    this.setData({
      thatOpenid: opt.seller_id,
      thatNickName: opt.seller_nickName,
      thatAvatar: opt.seller_avatarUrl
    })
    console.log(this.data)

    
  },

  

  onShow: function (options) {
    //判断有没有定义
    if (app.globalData.userInfo) {
      this.setData({
        openid: app.globalData.openid,
        userInfo: app.globalData.userInfo,//在mine里面进行赋值
        friends: app.globalData.friends,

      });
      
      console.log(this.data.friends);
      console.log(this.data.userInfo);
    } else {
      console.log("onShow is failed");
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

    
  },

//检查是否开过房
  check() {
    let that = this;
    //roomId两种组合方式
    var roomId1 = that.data.thatOpenid + that.data.openid;
    var roomId2 = that.data.openid + that.data.thatOpenid;
    console.log('room1=',roomId1);
    console.log('room2=',roomId2);
    if(that.data.friends.length !== 0){
      for (var i = 0; i < that.data.friends.length; i++){

        var num = that.data.friends[i].roomId;
        if (num == roomId1 ){
          that.setData({
            isFriend: 1,
            room: roomId1
          })

        } else if (num == roomId2){
          that.setData({
            isFriend: 1,
            room: roomId2
          })

        } else {
          console.log('未与该用户进行过聊天');
          that.setData({
            room: roomId1
          });
          that.startChatting();

        }
      }
    }else{
      console.log('未参与任何聊天');
      that.setData({
        room: roomId1
      });
      that.startChatting();

    };

    that.chat();
  },

  startChatting() {
    let that = this;
    wx.cloud.callFunction({
      name: 'chat_demo1',
      data: {
        $url: "addFriend", //云函数路由参数
        userOpenid: that.data.openid,
        
        userAvatar: that.data.userInfo.avatarUrl,
        userNickName: that.data.userInfo.nickName,
        thatOpenid: that.data.thatOpenid,
        thatNickName: that.data.thatNickName,
        thatAvatar: that.data.thatAvatar,
        roomId: that.data.room
      },
      success: res => {
        
        console.log('数据添加结果',res);
        app.globalData.friends = res.result.data[0].friends;
        console.log('friends', app.globalData.friends);

        
      },
      fail: res=> {
        console.log(res);
        wx.hideLoading();
        wx.showToast({
          title: 'error',
          icon: 'none',
        })
      }
    });
  },

  chat() {
    let that = this;
    wx.navigateTo({
      url: '/pages/im/room/room?id=' + that.data.room + '&name=' + that.data.thatNickName
    })

  },









})
