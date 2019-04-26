const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userPic: '',
    userName: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
   
    var user = wx.getStorageSync('globalData') || null
    var userid = (user.user.id != undefined) ? user.user.id : 0;
    console.log(userid)
    if (user == undefined) {
      wx.navigateTo({
        url: '../../impower/impower',
      })
    }
    that.setData({
      userid: userid,
      userPic: user.userInfo.avatarUrl,
      userName: user.userInfo.nickName,
    })
    console.log(app)
  },
  //健康科普
  goToindex() {
    wx.navigateTo({
      url: '../../pages/index/index',
    });
  },
  //免费提问
  goTodoctorList() {
    wx.navigateTo({
      url: '../../pages/doctorList/doctorList',
    });
  },
  //名医精选
  goToquestion() {
    wx.navigateTo({

      url: '../../pages/question/question',
    });
  },
  //我的提问
  goTomayquestions() {
    wx.navigateTo({
      url: '../../pages/mayquestions/mayquestions',
    });
  },
  //分享页面 
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '民福康-个人中心',
      path: '/pages/center/center?share_query=center',
    }
  },
})