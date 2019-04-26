// pages/videohome/videohome.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    homeList:[],
    illnessList: [],
    TostShow: false,
    isHide: 'none',
    off_on: false,
    page:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
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
      url: 'https://api.mfk.com/app/api/mfk_shipin_app2.php?type=home_shipin' + "&page=" + that.data.page,
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        that.loadingHide()
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
  
  onReachBottom: function () {
    var that = this
    that.loadingShow()
    that.data.page++
    that.loadList()
  },
  //视频详情
  goToDetails(e) {
    let id = e.currentTarget.dataset.id
    let types = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '../../pages/video/video?videoId=' + id,
    });
  },
  //更多疾病列表页面
  goTodiseaseList() {
    wx.navigateTo({
      url: '../../pages/diseaseList/diseaseList',
    });
  },
  //疾病详情
  goToDisease(e) {
    console.log(e)
    let id = e.currentTarget.dataset.illnessid
    let name = e.currentTarget.dataset.name
    let that = this;
    wx.navigateTo({
      url: '../../pages/disease/disease?diseaseId=' + id + "&name=" + name + "&types=1",
    });
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
  onShareAppMessage: function () {
    var that = this;
    return app.share(
      '/pages/videohome/videohome?share_query=videohome',
    );
  }
})