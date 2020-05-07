// pages/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    show: false,
    authCode: '',
    trueAuthCode: '',
    college_list: [],
    voteArr:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    wx.showLoading()
    that.setData({
      event_name:options.event_name,
      id: options.id,
      voteArr: wx.getStorageSync('vote_'+options.id)
    })
    
    wx.cloud.callFunction({
      name: 'getCollege',
      data:{
        event_id: parseInt(options.id)
      },
      success: res => {
        this.setData({
          college_list: res.result.data
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [getCollege] 调用失败：', err)
      }
    })
    //如果有密码就输入密码，否则退出
    if (options.password) {
      this.setData({
        trueAuthCode: options.password,
        show: true
      });
      let auth = 'authcode_' + this.data.id
      if (wx.getStorageSync(auth)) {
        this.setData({
          authCode: wx.getStorageSync(auth)
        });
      }
    }
    wx.hideLoading()
  },

  onConfirm(event) {
    if (this.data.authCode == this.data.trueAuthCode) {
      console.log("登陆成功")
      let auth = 'authcode_' + this.data.id
      wx.setStorageSync(auth, this.data.authCode)
    } else {
      wx.navigateBack({
        delta: 1,
      })
      console.log("登陆失败")
      wx.showToast({
        title: '授权码错误',
        icon: 'none',
        duration: 2000,
        mask: true,
      })
    }
  },

  onChange(event) {
    // event.detail 为当前输入的值
    console.log(event.detail);
    let that = this
    that.setData({
      authCode: event.detail.value
    });
  },

  onClose() {
    this.setData({
      close: false
    });
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