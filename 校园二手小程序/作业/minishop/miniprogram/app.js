//app.js
App({
  onLaunch: function () {
    let that = this
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'barry-0l96x',
        traceUser: true,
      })
    }

    const db = wx.cloud.database();

    wx.cloud.callFunction({
      name: 'chat_demo1', // 对应云函数名
      data: {
        $url: "openid", //云函数路由参数
      },
      success: re => {
        console.log(re)
        db.collection('user').where({
          _openid: re.result,
           _id: re.result
        }).get({
          success: function (res) {
            console.log('数据库查询结果',res.data)
            if(res.data.length !== 0){
              that.globalData.openid = res.data[0]._openid
              // that.globalData.userInfo = res.data[0].userInfo
              that.globalData.friends = res.data[0].friends
              that.globalData.data = res.data[0]
              console.log('运行了吗？')
              

            }else{
              that.globalData.openid = re.result
              that.globalData.friends = []

            }
            console.log('初始读取globaldata', that.globalData)
          }
        })
      }
    })

    this.globalData = {}
  }
})
