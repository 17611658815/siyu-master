// pages/mayquestions/mayquestions.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: ["待回答", "已回答"],
    currentTab: 0,
    one:1,
    userid:"",
    askList: [],
    haveanswer:[]
  },
  onLoad(options){
     let that = this
    var userid = (app.globalData.user != undefined) ? app.globalData.user.id : 0;
    if (userid == 0) {
      app.getUserInfo(that.onLoad);
      return
    }
    that.setData({
      userid: userid,
    })
    that.answer()
  },
  //问答详情
  goTodetailsproblem(e){
    var id = e.currentTarget.dataset.id
     wx.navigateTo({
       url: '../../pages/detailsproblem/detailsproblem?id='+ id,
     })
  },
  //tab切换
  swichNav: function (e) {
    let that = this;
    console.log(e.currentTarget.dataset.current)
    that.setData({
      currentTab: e.currentTarget.dataset.current
    });
    if (that.data.currentTab == 0){
      that.answer()
    }else{
      that.Askanswer()
    }
  },
  //已回答

  // 待回答
  answer(){
    let that = this
    wx.request({
      url: "https://api.mfk.com/app/api/mfk_shipin_app2.php?type=question_list&answer=0",
      data: {
        uid: that.data.userid,
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          askList: res.data.list
        });
        
      }, 
      
    })
  },
  //回答
  Askanswer() {
    let that = this
    wx.request({
      url: "https://api.mfk.com/app/api/mfk_shipin_app2.php?type=question_list&answer=1",
      data: {
        uid: that.data.userid,
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          haveanswer: res.data.list
        });

      }
    })
  },
  //去提问
  goask(){
    wx.switchTab({
      url: '../question/question',
    }) 
  },
  
  //分享页面 
  onShareAppMessage: function () {
    var that = this;
    return app.share(
      '/pages/index/index',
    );
  },
})