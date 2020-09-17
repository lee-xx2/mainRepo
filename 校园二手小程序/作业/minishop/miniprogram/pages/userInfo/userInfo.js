const db=wx.cloud.database()//连接数据库

Page({
  data:{
    userinfo:"",//用户表
    flag: 0,
    goodlist0:"",
    goodlist1:"",
    openid: ''
      
  },
  onLoad: function (opt) {
    this.setData({
      openid: opt.id
    })
    console.log(this.data.openid)
    
    // wx.setNavigationBarTitle({
    //   title: opt.name
    // })
  },
  getData(){
    db.collection("user").where({
      _id: this.data.openid
    }).get({
      success:res=>{
        console.log(res)
        this.setData({
          userinfo:res.data
        })
      
      }
    })//表名
  },
  getList0(){
    db.collection("goods").where({
      Transaction_status:'0',
      _openid: this.data.openid

    }).get({
        success:res=>{
        console.log("成功")
        console.log(res)
        this.setData({
          goodlist0:res.data
        })
      }
    })//表名
  },
  getList1(){
    db.collection("goods").where({
      Transaction_status:'1',
      _openid: this.data.openid
    }).get({
        success:res=>{
        console.log("成功")
        console.log(res)
        this.setData({
          goodlist1:res.data
        })
      }
    })//表名
  },
  
  goToLocation:function(){
    wx.navigateTo({
      url: '/pages/Location/Location',
    })
  },
  switchNav: function(e) {
    var id = e.target.id;
    var page = this;
    if (this.data.flag == id) {
      return false;
    } else {
      page.setData({
        flag: id
      });
    }
  }
  
  
  
  
  
})
