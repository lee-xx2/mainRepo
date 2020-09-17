const app = getApp();
Page({
  data: {
    /*
    school:'',
    schoolArea:'',
    major:'',
    phone:'',
    wxNumber:''*/
  },
  onLoad: function (options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
  },
  formSubmit: function (e) {
    console.log('表单提交，数据为：', e.detail.value)
    if (e.detail.value.school != null & e.detail.value.school != '') {
      this.setData({
        school: e.detail.value.school,
      })
    }
    if (e.detail.value.schoolArea != null & e.detail.value.schoolArea != '') {
      this.setData({
        schoolArea: e.detail.value.schoolArea,

      })
    }
    if (e.detail.value.major != null & e.detail.value.major != '') {
      this.setData({
        major: e.detail.value.major,

      })
    }
    if (e.detail.value.phone != null & e.detail.value.phone != '') {
      this.setData({
        phone: e.detail.value.phone,

      })
    }
    if (e.detail.value.wxNumber != null & e.detail.value.wxNumber != '') {
      this.setData({
        wxNumber: e.detail.value.wxNumber,

      })
    }
  }
  ,
  onUpdate: function () {
    const db = wx.cloud.database()
    db.collection('user').doc(this.data.openid
    ).update({
      data: {
        school: this.data.school,
        schoolArea: this.data.schoolArea,
        major: this.data.major,
        phone: this.data.phone,
        wxNumber: this.data.wxNumber
      },
      success: res => {
        console.log('[数据库] [更新记录] 成功 ')
      },
      fail: err => {
        console.error('[数据库] [更新记录] 失败：', err)
      }
    })
  },
  onShow: function () {
    const db = wx.cloud.database()
    db.collection('user').doc(this.data.openid)
      .get()
      .then(res => {
        console.log(res.data)
        this.setData({
          user: res.data
        })
      })
  }

})