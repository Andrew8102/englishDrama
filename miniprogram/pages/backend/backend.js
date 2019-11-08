// pages/backend/backend.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    email: "",
    show: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  openDialog(e) {
    this.setData({
      show: true
    })
  },

  sendmail(e) {
    //先正则检查邮件是否正确
    let that = this
    if (!(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(that.data.email))) {
      wx.showToast({
        title: '请输入正确的邮箱地址',
        icon:'none'
      })
      return false;
    }else{
      wx.cloud.callFunction({
        name: 'sendMail',
        data: {
          email_address: that.data.email
        },
        success: res => {
          wx.showToast({
            icon: 'success',
            title: '发送成功',
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '调用失败',
          })
          console.error('[云函数] [sendMail] 调用失败：', err)
        }
      })
    }
  },

  mail(event) {
    let that = this
    that.setData({
      email: event.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})