// pages/detail/detail.js
import Dialog from '../../dist/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    buttonText: "开始投票",
    button: false,
    sum: 0,
    program: {},
    voteList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.setData({
      event_id: options.event_id,
      college_id: options.college_id,
      event_name: options.event_name
    })
    wx.cloud.callFunction({
      name: 'getRule',
      data: {
        event_id: parseInt(that.data.event_id),
      },
      success: res => {
        this.setData({
          voteList: res.result.data[0].rule
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [getRule] 调用失败：', err)
      }
    })
    wx.cloud.callFunction({
      name: 'getDetail',
      data: {
        event_id: parseInt(that.data.event_id),
        college_id: parseInt(that.data.college_id)
      },
      success: res => {
        this.setData({
          program: res.result.data[0]
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [getDetail] 调用失败：', err)
      }
    })
    let hasMarkedArr = wx.getStorageSync('vote_' + options.event_id);
    console.log(hasMarkedArr)
    console.log(options.college_id)
    console.log(hasMarkedArr.includes(options.college_id))
    if (hasMarkedArr.includes(parseInt(options.college_id))) {
      that.setData({
        button: true,
        buttonText: "您已参加过评分"
      })
    }
  },

  onVote() {
    let that = this
    if (!wx.getStorageSync('userInfo')) {
      Dialog.alert({
        title: '您还未登陆',
        message: '请先在个人中心登陆'
      }).then(() => {
        //on confirm
        wx.redirectTo({
          url: '../user/user',
        })
        return
      })
    }

    that.setData({
      show: true
    })
  },

  onClose() {
    this.setData({
      show: false
    });
  },

  onChange(e) {
    console.log("改变值为：" + e.detail)
  },

  voteSubmit(e) {
    let that = this
    let userInfo = wx.getStorageSync('userInfo')
    Dialog.confirm({
      title: '确定提交吗',
      message: '您当前为 ' + that.data.program.school + ' ' + that.data.program.title + ' 的评分为 ' + that.data.sum + ' 分,提交后评分无法更改'
    }).then(() => {
      // on confirm
      wx.cloud.callFunction({
        name: 'voteSubmit',
        data: {
          event_id: parseInt(that.data.event_id),
          college_id: parseInt(that.data.college_id),
          mark: parseInt(that.data.sum),
          school: that.data.program.school,
          voter_openid: wx.getStorageSync('openid'),
          nickName: userInfo.nickName,
          title: that.data.program.title,
          truename: wx.getStorageSync('truename'),
          userSchool: wx.getStorageSync('userSchool'),
          event_name:that.data.event_name
        },
        success: res => {
          console.log("成功投票")
          if (wx.getStorageSync('vote_' + that.data.program.event_id)) {
            var hasMarkedArr = wx.getStorageSync('vote_' + that.data.program.event_id);
          } else {
            var hasMarkedArr = Array()
          }
          hasMarkedArr.push(that.data.program.college_id)
          wx.setStorageSync('vote_' + that.data.program.event_id, hasMarkedArr)
          wx.redirectTo({
            url: '../success/success',
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '提交失败',
          })
          console.error('[云函数] [voteSubmit] 调用失败：', err)
        }
      })
    }).catch(() => {
      // on cancel
    });
  },
  plus(e) {
    let that = this
    that.setData({
      sum: that.data.sum + 1
    })
  },

  minus(e) {
    let that = this
    that.setData({
      sum: that.data.sum - 1
    })
  },

  //焦点就删掉
  focus(e) {
    console.log("点击获取焦点则删除当前输入" + e.detail.value)
    let that = this
    that.setData({
      sum: that.data.sum - parseInt(e.detail.value)
    })
  },

  //失去焦点就加上
  blur(e) {
    console.log("失去焦点则加上当前输入" + e.detail.value)
    //避免出现删除了失去焦点出现sum加上null的情况
    if (e.detail.value != "") {
      let that = this
      that.setData({
        sum: that.data.sum + parseInt(e.detail.value)
      })
    }
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