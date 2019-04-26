// pages/attentionDoctor/attentionDoctor、.js
const app = getApp()
Page({

  data: {
     userid:'',
     doctorList:[],
     page:1,
  },
  onPullDownRefresh: function () {
    var that = this
   
    wx.showNavigationBarLoading() //在标题栏中显示加载
    that.onLoad()
    //模拟加载
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  }, 
  //返回刷新数据
  onShow() { 
    // this.onLoad()
    this.getDoctorList()
  },
 
  onLoad: function (options) {
    var that = this

    var user = wx.getStorageSync('globalData') || null
    var userid = (user.user.id != undefined) ? user.user.id : 0;
    if (userid == 0) {
      app.getUserInfo(that.onLoad);
      return
    }
    console.log(userid)
    that.setData({
      userid: userid,
    })  
    that.getDoctorList()
  },
  onReachBottom: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    that.data.page++
    wx.request({
      url: app.globalData.ip +'?type=get_collection&id=' + that.data.userid + "&page=" + that.data.page,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var list = that.data.doctorList
        for (var i = 0; i < res.data.data.length;i++)
        {
          list.push(res.data.data[i])
        }
        that.setData({
          doctorList: list
        })
        wx.hideLoading() 
      }
    })
  },
  //获取关注医生
  getDoctorList(){
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.ip +'?type=get_collection&id=' + that.data.userid ,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          doctorList: res.data.data
        }) 
        wx.hideLoading() 
      }
    })

  },
  //搜索页面
  goToDoctorInfo(e) {
    var that = this
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../pages/doctorHomePage/doctorHomePage?doctorId='+id,
    });
  },
  //分享页面 
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '民福康-关注专家',
      path: '/pages/attentionDoctor/attentionDoctor?userid=' + that.data.userid
    }
  },
})