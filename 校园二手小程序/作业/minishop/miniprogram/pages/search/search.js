// pages/search/search.js
Page({
  /**
   * 页面的初始数据
   * 1 输入框使用了防抖技术 通过定时器防止重复输入 重复发送请求
   */
  data: {
    queryResult: [],
    inputVal:""
  },
  TimeId:-1,

  handleinput(e){
    //获取输入框的值
    const {value}=e.detail;
    //检测合法性
    if(!value.trim()){
      //值不合法，空值或包含空格
      this.setData({
        queryResult: []
      })
      return;
    }

    clearTimeout(this.TimeId);
    this.TimeId=setTimeout(()=>{
      wx.cloud.callFunction({
        name:'selectByName_Type',
        data:{
          value:value
        },
        success: res => {
          this.setData({
            //云函数的结果内容获取应该加个result!
            queryResult: res.result.data
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
    },1000);
  },

//点击取消按钮，清空搜索框内容以及搜索结果
  handleCancel(){
    this.setData({
      queryResult: [],
      inputVal:""
    })
  }

})