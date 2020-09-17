// pages/goods_detail/goods_detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    queryResult:[],
    userInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {_id}=options;
    this.getGoodsDetail(_id);
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }
  },

  //获取商品详情页信息
  getGoodsDetail(_id){
    //调用云函数并进行数据库查询
    wx.cloud.callFunction({
      name:'selectGoodsById',
      data:{
        _id:_id
      },
      success: res => {
         this.setData({
        // 优化小程序性能，只需传7个属性，而非10个
           queryResult:{
            bulletin_date:res.result.data[0].bulletin_date,
            price:res.result.data[0].price,
            original_price:res.result.data[0].original_price,
            goods_name:res.result.data[0].goods_name,
            img:res.result.data[0].img,
            spec:res.result.data[0].spec,
            _openid:res.result.data[0]._openid
          }
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      }, 
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  // 点击轮播图进行放大预览
  handlePriview(e){
  // 1 先构造要预览的图片数组
    const urls = this.data.queryResult.img;
  // 2 接受传递过来的图片url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    });
  },

  //跳转并传送卖家头像和昵称信息到聊天页面
  sendSellerInfo(){
    var seller_id=this.data.queryResult._openid;
    const db = wx.cloud.database()
    db.collection("user").where({
      _openid:seller_id
    }).get({
      success: res =>{
       
        this.setData({
          seller_nickName:res.data[0].nickName,
          seller_avatarUrl:res.data[0].avatarUrl,
          seller_id:seller_id
        })
        console.log('[数据库] [查询记录] 成功: ', res)
         wx.navigateTo({
          //  跳转路径待整合时修改，目前仅是测试
          url: '../im/im?seller_nickName='+this.data.seller_nickName+'&seller_avatarUrl='+this.data.seller_avatarUrl+'&seller_id='+this.data.seller_id
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '跳转失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })   
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    wx.showShareMenu({
      withShareTicket: true
    })
    let that = this
    return {
      title: that.data.userInfo.nickName+"分享了"+that.data.queryResult.goods_name+"给你哦~",
      imageUrl:that.data.queryResult.img[0],
      success: res =>{
        wx.showToast({
          title: '转发成功'
        })
        console.log(res, "转发成功")
      },
      fail: res =>{
        wx.showToast({
          icon: 'none',
          title: '转发失败'
        })
        console.log(res, "转发失败")
      }
    }
  }
})