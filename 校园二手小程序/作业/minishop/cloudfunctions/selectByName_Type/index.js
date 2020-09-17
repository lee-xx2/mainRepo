// 云函数入口文件
const cloud = require('wx-server-sdk')

// cloud.init({
//   env: 'class-01uow'
// })
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
 // const wxContext = cloud.getWXContext()
  var value = event.value
  const _ = db.command
  try {
    //多字段对goods_name，type进行模糊查询，一开始这里忘了加return await,导致一直调用成功但没有结果输出。。。
    return await db.collection('goods').where(
        _.or([
        {
          goods_name:db.RegExp({
            regexp:'.*'+ value,
            //想要搜索的内容
            option: 'i'
            //不区分大小写
          })
        },
        {
          type:db.RegExp({
            regexp:'.*'+ value,
            //想要搜索的内容
            option: 'i'
            //不区分大小写
          })
        }
      ]).and([{
        Transaction_status:'0'
        //一开始0这里忘了加冒号，一直查询出错
      }])       
    ).get()
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