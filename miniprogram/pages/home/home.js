Page({
  data: {
    active: 0,
    event_list: []
  },
  // event.detail 的值为当前选中项的索引
  onChange(event) {
    console.log(event.detail);
    if(event.detail==1){
      wx.reLaunch({
        url: '../user/user',
      })
    }
  },

  click_event(event) {
    console.log("what" + event.target)
  },

  onLoad(){
    wx.showLoading()
    wx.cloud.callFunction({
      name: 'getEvent',
      success: res => {
        this.setData({
          event_list: res.result.data.reverse()
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
    wx.hideLoading()
  }
});