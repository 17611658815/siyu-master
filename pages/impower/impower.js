// pages/impower/impower.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //获取用户信息
  GotUserInfo() {
    wx.getUserInfo({
      success: function (res) {
        console.log(res)
        app.getUserInfo()
        // wx.navigateTo({
        //   url: '../../pages/index/index',
        // })
      }
    })
  },

})