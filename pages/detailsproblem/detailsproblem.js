// pages/detailsproblem/detailsproblem.js
var app = getApp()
Page({

  data: {
    id:'',
    askInfo:{},
    picList:[],
  },
  onLoad(options){
    var that = this
   
    that.setData({
      id: options.id,
    })  
    that.getAskInfo()
  },
  imgYu(e) {
    var that = this
    var current = e.currentTarget.dataset.src;//获取data-src
    //图片预览
    wx.previewImage({
      current: current,
      urls: that.data.picList 
    })
  },
  getAskInfo(){
    var that = this
    wx.request({
      url: app.globalData.ip +'?type=question_info&id='+that.data.id,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res)
        // wx.hideLoading()
        console.log(res)
        that.setData({
          askInfo: res.data.question, //赋值渲染
          picList: res.data.question.pic
        });
        console.log(that.data.picList)
      }
    })
  },
  //分享页面 
  onShareAppMessage: function () {
    var that = this;
    return app.share(
      '/pages/detailsproblem/detailsproblem?share_query=detailsproblem',
    );
  },
})