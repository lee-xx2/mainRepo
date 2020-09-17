const app = getApp();
const db = wx.cloud.database();
var util = require("../util/util.js");
Page({
  data: {
    markers:[{
      iconPath:"/images/location.png",
      id:0,
      latitude: 23.195541,
      longitude: 113.364731,
      width:40,
      height:40
    },{
        iconPath: "/images/location.png",
        id: 0,
        latitude: 23.195541,
        longitude: 113.364731,
        width: 40,
        height: 40
    },{
        iconPath: "/images/location.png",
        id: 0,
        latitude: 23.195541,
        longitude: 113.364731,
        width: 40,
        height: 40
    }],
    latitude: 23.195541,
    longitude: 113.364731,
    address: '',
    imgbox: [],
    img: [],
    openid: "",
    bulletin_date:"",
    Transaction_status:"0",
    goods_name: "",
    price: "",
    type: "",
    original_price: "",
    spec: "",
    array: ['书籍', '美妆', '服饰', '食品','体育', '生活用品', '电子产品','其他'],
    objectArray: [{
      //id: 0,
     name: '书籍'
   },
   {
     // id: 1,
     name: '美妆'
   },
   {
     // id: 2,
     name: '服饰'
   },
    {
      // id: 3,
      name: '食品'
    },
   {
      //id: 4,
     name: '体育'
   },
   {
      //id: 5,
     name: '生活用品'
   },
   {
      //id: 6,
     name: '电子产品'
   },
     {
      // id: 7,
       name: '其他'
     }],
  },
 
  getLocation:function(){
    var _this=this;
    wx.chooseLocation({
     success: function (res) {
      var address = res.address
      _this.setData({
       address: address,
      })
     }
    })
   },

  //获取商品名
  nameinput: function (e) {
    this.setData({
      goods_name: e.detail.value
    })
  },

  //获取商品详情
  detailinput: function (e) {
    this.setData({
      spec: e.detail.value
    })
  },

  // 获取价格
  priceInput: function (e) {
    this.setData({
      price: e.detail.value
    })
    var price = this.data.price;
    var int = parseInt(price)
    this.data.price = int
  },
  // 获取原价
  originalpriceInput: function (e) {
    this.setData({
      original_price: e.detail.value
    })
    var original_price = this.data.original_price;
    var int = parseInt(original_price)
    this.data.original_price = int
  },

  //获取分类,选择框
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', this.data.array[e.detail.value])
    this.setData({
      type:  this.data.array[e.detail.value]
    })
  },

// 删除照片 
  imgDelete: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.deindex;
    let imgbox = this.data.imgbox;
    imgbox.splice(index, 1)
    that.setData({
      imgbox: imgbox
    });
  },
  // 选择图片
  addPic: function (e) {
    var imgbox = this.data.imgbox;
    console.log(imgbox)
    var that = this;
    var n = 6;
    if (6 > imgbox.length > 0) {
      n = 6 - imgbox.length;
    } else if (imgbox.length == 6) {
      n = 1;
    }
    wx.chooseImage({
      count: 6, // 设置图片张数
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        if (imgbox.length == 0) {
          imgbox = tempFilePaths
        } else if (6 > imgbox.length) {
          imgbox = imgbox.concat(tempFilePaths);
        }
        that.setData({
          imgbox: imgbox
        });
      }
    })
  },
  //图片
  imgbox: function (e) {
    this.setData({
      imgbox: e.detail.value
    })
  },


  onLoad: function (options) { 
    if (app.globalData.userInfo) {
      wx.showToast({
        icon: 'none',
        title: '请登陆后发布',
        complete: res => {
          setTimeout(function() {
            wx.switchTab({
              url: '/pages/mine/mine',
            })
          }, 2000);
        }
      })
    }
    
    var bulletin_date = util.formatTime(new Date());
    this.setData({
      bulletin_date: bulletin_date
    });
  },
  onReady: function () {
    this.mapCtx = wx.createMapContext('myMap')
   },
  onShow: function () { },
  onHide: function () {},
  onUnload: function () {},

  //form获取发布二手商品信息
  getsubmit: function (e) {
   /* if (!app.globalData.openid) {
      wx.showToast({
        icon: 'none',
        title: '请先登陆',
        complete: res => {
          setTimeout(function() {
           wx.switchTab({
           url: '/pages/me/me', //我的页面
            })
          }, 2000);
        }
      })
      return
    }*/
    
    var bulletin_date = util.formatTime(new Date());
    this.setData({
      bulletin_date: bulletin_date
    });
    var that = this;
    var get = this.data;
   
    if (!this.data.imgbox.length) {
      wx.showToast({
        icon: 'none',
        title: '图片不能少于1张',
        duration: 2000
      })
    } else if (get.goods_name.length == 0) {
      wx.showToast({
        title: '商品名称不能为空！',
        icon: "none",
        duration: 2000
      })
    } else if (get.original_price.length == 0) {
      wx.showToast({
        title: '原价不能为空！',
        icon: "none",
        duration: 2000
      })
    } else if (get.price.length == 0) {
      wx.showToast({
        title: '价格不能为空！',
        icon: "none",
        duration: 2000
      })
    } else if (get.type.length == 0) {
      wx.showToast({
        title: '分类不能为空！',
        icon: "none",
        duration: 2000
      })
    } else {
      wx.showLoading({
        title: '正在发布',
      })
      const promiseArr = []
        for (let i = 0; i < this.data.imgbox.length;i++) {
          promiseArr.push(new Promise((resolve,reject)=>{
          let filePath = this.data.imgbox[i]
          let suffix =  /\.\w+$/.exec(filePath)[0]; // 正则表达式，获取文件扩展名
          //在每次上传的时候，就往promiseArr里存一个promise，只有当所有的都返回结果时，才可以继续往下执行
            wx.cloud.uploadFile({
              cloudPath: new Date().getTime() + suffix,
              filePath: filePath, // 文件路径
            }).then(res => {
              console.log(res.imgbox)
              this.setData({
                img: this.data.img.concat(res.fileID)
              })
              resolve()
            }).catch(error => {
              console.log(error)
            })
          }))
        }

        Promise.all(promiseArr).then(res=>{
        db.collection('goods').add({
          data: {
                  goods_name: get.goods_name,
                  spec: get.spec,
                  original_price: get.original_price,
                  price: get.price,
                  type: this.data.type,
                  Transaction_status: "0",
                  bulletin_date:bulletin_date,
                  img: this.data.img,
                  address:this.data.address,
                },
        })
        .then(res => {
          console.log(res)
          wx.hideLoading()
          wx.showToast({
            title: '发布成功',
          })
          this.setData({
            address: '',
            imgbox: [],
            img: [],
            bulletin_date:"",
            goods_name: "",
            price: "",
            type: "",
            original_price: "",
            spec: "",
          })
        })
          fail: err => {
                  wx.hideLoading();
                  wx.showToast({
                    icon: 'none',
                    title: '发布失败'
                  })
                }
})
}
}
})