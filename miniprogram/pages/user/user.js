// pages/user/user.js
var App = getApp()
import Dialog from '../../dist/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 1,
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    show: false,
    show2nd: false,
    username: '',
    password: '',
    truename: '请点击登陆',
    userSchool: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    if (wx.getStorageSync('userSchool')) {
      that.setData({
        userSchool: wx.getStorageSync('userSchool')
      })
    }
    if (wx.getStorageSync('truename')) {
      that.setData({
        truename: wx.getStorageSync('truename')
      })
    }
    if (wx.getStorageSync('logged')) {
      that.setData({
        logged: wx.getStorageSync('logged')
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
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
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

  truename(event) {
    // event.detail 为当前输入的值
    console.log(event.detail);
    let that = this
    that.setData({
      truename: event.detail.value
    });
  },

  userSchool(event) {
    // event.detail 为当前输入的值
    console.log(event.detail);
    let that = this
    that.setData({
      userSchool: event.detail.value
    });
  },

  getInfo(e) {
    console.log("点击了按钮")
    let that = this
    that.setData({
      show2nd: false
    });
    // this.onGetOpenid()
    // Dialog.confirm({
    //   title: '确定提交吗',
    //   message: '您当前为分,提交后评分无法更改'
    // }).then(() => {
    //   // on confirm 
    // }).catch(() => {
    //   // on cancel
    // });
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

  onConfirm2(e) {
    let that = this
    Dialog.confirm({
      title: '确定提交吗',
      message: '您填写的内容为：'+that.data.userSchool+" "+that.data.truename+' 提交后个人信息将无法更改'
    }).then(() => {
      // on confirm 
      wx.setStorageSync('userSchool', that.data.userSchool)
      wx.setStorageSync('truename', that.data.truename)

    }).catch(() => {
      // on cancel
      that.setData({
        show2nd: true
      });
    });
  },

  onGetUserInfo: function (e) {
    let that = this
    console.log(e)
    if (!this.data.logged && e.detail.userInfo) {
      that.setData({
        show2nd: true,
        truename:''
      });
      this.onGetOpenid();
      wx.setStorageSync('userInfo', e.detail.userInfo)
      wx.setStorageSync('logged', true)
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }else if(!this.data.logged){
      Dialog.alert({
        title: '关于授权内容',
        message: '授权仅限于获得您的微信资料页信息，包括头像、昵称等资料,并不包含隐私个人信息包括微信号手机号等，请放心授权'
      }).then(() => {
        // on confirm 
  
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
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})