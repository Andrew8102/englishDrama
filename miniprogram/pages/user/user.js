// pages/user/user.js
var App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 1,
    avatarUrl: './user-unlogin.png',
    userInfo: {
      'nickName': '请点击登陆'
    },
    logged: false,
    show: false,
    username: '',
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
    let that = this
    if (wx.getStorageSync('username')) {
      that.setData({
        username: wx.getStorageSync('username')
      })
    }
    if (wx.getStorageSync('password')) {
      that.setData({
        password: wx.getStorageSync('password')
      })
    }
  },

  // event.detail 的值为当前选中项的索引
  onChange(event) {
    console.log(event.detail);
    if (event.detail == 0) {
      wx.reLaunch({
        url: '../home/home',
      })
    }
  },

  onContact(e) {
    wx.setClipboardData({
      data: "sudakxhd@163.com",
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },

  //后台数据
  backEnd(e) {
    let that = this
    that.setData({
      show: true
    })
  },

  username(event) {
    // event.detail 为当前输入的值
    console.log(event.detail);
    let that = this
    that.setData({
      username: event.detail.value
    });
  },

  password(event) {
    // event.detail 为当前输入的值
    console.log(event.detail);
    let that = this
    that.setData({
      password: event.detail.value
    });
  },

  onConfirm(e) {
    let that = this

    if (that.data.username == App.globalData.username) {
      if (that.data.password == App.globalData.password) {
        wx.navigateTo({
          url: '../backend/backend',
        })
        wx.setStorage({
          key: 'username',
          data: that.data.username,
        })
        wx.setStorage({
          key: 'password',
          data: that.data.password
        })
      } else {
        wx.showToast({
          title: '密码错误',
          icon: 'none'
        })
      }
    } else {
      wx.showToast({
        title: '用户名错误',
        icon: 'none'
      })
    }
  },

  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.onGetOpenid();
      wx.setStorageSync('userInfo', e.detail.userInfo)
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid(e) {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        let openid = res.result.openid
        wx.setStorageSync('openid', openid)
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
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