// 云函数入口文件
const cloud = require('wx-server-sdk')

// cloud.init({
//   env: 'class-01uow'
// })
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  //const wxContext = cloud.getWXContext()

  var _id = event._id
  try {
    return await db.collection('goods').where({
      _id: _id
    }).get()
  } catch (e) {
    console.log(e)
  }

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}