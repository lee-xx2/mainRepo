// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return cloud.database().collection("goods").aggregate().match({
      type: event.a,
      Transaction_status:"0"
  })
  .lookup({
    from:"user",
    localField:'_openid',
    foreignField:'_openid',
    as:'user'
  }).end({
    success:function(res){
      return res;
    },
    fail(error){
      return error;
    }
  })
}