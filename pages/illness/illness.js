// pages/illness/illness.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    illness:{},
    ksId:'',

  },

  onLoad: function (options) {
    var that = this
   
    that.setData({
      ksId: options.id,
    })
    that.getIllness()
  },
  getIllness(){
    let that = this
    wx.request({
      url: 'https://api.mfk.com/app/api/mfk_shipin_app2.php?type=department_illness&id=' + that.data.ksId,
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        that.setData({
          illness: res.data
        })
      }
    })
  },
  gotodiseaseList: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    console.log(id)
    wx.navigateTo({
      url: "../../pages/disease/disease?diseaseId=" + id + '&name=' + name,
    });
    that.setData({
      diseaseId: id
    })
  },
  //搜索页面
  goToSearch() {
    wx.navigateTo({
      url: '/pages/illness/illness?id=' + that.data.ksId,
    });
  },
  //分享页面 
  onShareAppMessage: function () {
    var that = this;
    return app.share(
      '/pages/illness/illness?id=' + that.data.ksId +'&share_query=illness',
    );
  },
})