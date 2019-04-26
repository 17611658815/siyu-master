// pages/askhome/askhome.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    homeList:[],
    illnessList:[],
    TostShow: false,
    isHide: 'none',
    off_on: false,
    page:1,
  },
  onLoad: function (options) {
    var that = this
    that.loadList()
  },

  loadList() {
    let that = this
    var off_on = that.data.off_on
    if (off_on == true) {
      return
    }
    off_on = true
    wx.request({
      url: 'https://api.mfk.com/app/api/mfk_shipin_app2.php?type=home_ask' + "&page=" + that.data.page,
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        that.loadingHide()
        console.log(res)
        that.setData({
          illnessList: res.data.illness
        })
        if (res.data.list.length > 0) {
          var list = that.data.homeList
          for (var i = 0; i < res.data.list.length; i++) {
            list.push(res.data.list[i])
          }
          that.setData({
            homeList: list,
            off_on: false,

          })
        } else {
          that.setData({
            isHide: 'none',
            TostShow: true,
            off_on: true
          })
        }
      }
    })
  },
  //更多疾病列表页面
  goTodiseaseList() {
    wx.navigateTo({
      url: '../../pages/diseaseList/diseaseList',
    });
  },
  //相关问答跳转
  goAsk(e) {
    let that = this;
    let askId = e.currentTarget.dataset.id;
    wx.redirectTo({
      url: '../../pages/answer/answer?id=' + askId,
    })
  },
  onReachBottom: function () {
    var that = this
    that.loadingShow()
    that.data.page++
    that.loadList()
  },
  //loadingShow
  loadingShow() {
    var that = this
    that.setData({
      hidenLoad: true,
      isHide: 'block',
    })
  },
  loadingHide() {
    var that = this
    that.setData({
      hidenLoad: true,
      isHide: 'none',
    })
  },
  // 疾病详情
  goToDisease(e) {
    console.log(e)
    let id = e.currentTarget.dataset.illnessid
    let name = e.currentTarget.dataset.name
    let that = this;
    wx.navigateTo({
      url: '../../pages/disease/disease?diseaseId=' + id + "&name=" + name + "&types=2",
    });
  },
  onShareAppMessage: function () {
    var that = this;
    return app.share(
      '/pages/askhome/askhome?share_query=askhome',
    );
  }
})