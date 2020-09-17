const envid = 'barry-0l96x'

// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router'); //云函数路由
const rq = require('request');



cloud.init({
  env: envid
})


const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })
  // const wxContext = cloud.getWXContext()
  //用户进行注册
  app.router('login', async (ctx) => {
    const wxContext = cloud.getWXContext()
    try {
      ctx.body = {
        data: wxContext
      }
    } catch (e) {
      console.error(e)
    }
    await db.collection('user').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        //小程序用户 openid，小程序端调用云函数时有
        _openid: wxContext.OPENID,
        
        school: event.school,
        major: event.major,
        wxNumber: event.wxNumber,
        phone: event.phone,
        
        
        
        schoolArea: event.schoolArea,
        
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        userInfo: event.userInfo,
        // nickName: event.nickName,
        // avatarUrl: event.avatarUrl,
        // gender: event.gender,
        
        stamp: event.stamp,
       
        friends: []
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      }
    })
  });

  //用户获取openid
  app.router('openid', async (ctx) => {
    const wxContext = cloud.getWXContext()
    ctx.body = wxContext.OPENID;
  });

  //获取用户信息
  app.router('huoquUserinfo', async (ctx) => {
    try {
      ctx.body = await db.collection('user').where({
        _openid: event.openid,
      }).get()
    } catch (e) {
      console.error(e)
    }
  });

  // app.router('getFriendList', async (ctx) => {
  //   try {
  //     ctx.body = await db.collection('user').where({
  //       _openid: event.openid,
  //     }).orderBy('stamp', 'asc').get()
  //   } catch (e) {
  //     console.error(e)
  //   }
  // });

  //记录参与过聊天的房间号与对方信息
  app.router('addFriend', async (ctx) =>{
    try{
      //更新自己的历史信息列表
      await db.collection('user').where({
        _id: event.userOpenid
      }).update({
        data: {
          friends: db.command.push([{ roomId: event.roomId, thatOpenid: event.thatOpenid, thatNickName: event.thatNickName, 
          thatAvatar: event.thatAvatar  }])
        }
      })
      //更新对方的历史信息列表
      await db.collection('user').where({
        _id: event.thatOpenid
      }).update({
        data: {
          friends: db.command.push([{ roomId: event.roomId, thatOpenid: event.userOpenid, thatNickName: event.userNickName, 
          thatAvatar: event.userAvatar }])
        }
      })
      ctx.body = await db.collection('user').where({
        _id: event.userOpenid
      }).get()

    }catch(e){
      console.error(e)
    }
    
  })

  //将ctx中的数据返回小程序端
  return app.serve();

  // //将ctx中的数据返回小程序端
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}