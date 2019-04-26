// pages/video/video.js
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp()
Page({
  data: {
      videoId:"",//视频id
      videoMsg:{},//视频信息
      page: 1,
      url: '',
      TostShow: false,
      isHide: 'none',
      off_on: false,
      autoHeight:'',
      posterShow:false,
      boXShow:true,
      isplay:false,
      goIndex:false,
      title:''
  },
  // onShow() {
  //   this.videoContext = wx.createVideoContext('video')
  //   // 全屏播放
  //   this.videoContext.requestFullScreen()
  //   var res = wx.getSystemInfoSync();
  //   //iphone x下隐藏状态栏，仅对IPHONE X生效
  //   if (res.model.search('iPhone X') != -1) {
  //     this.videoContext.hideStatusBar();
  //   }
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    
    that.setData({
      videoId: options.videoId,
      // url: 'https://api.mfk.com/html/mfk_video/video.html?id=' + options.videoId
    });
    console.log(options.bol)
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          autoHeight: ((res.windowWidth) / 16) * 9
        });
      }
    });
    //直接调用
    that.getVideo()
  },

  bindplay(){
    var taht = this
   
    this.setData({

      boXShow:false

    })
    
  },
  bindended(){
   var taht = this
    this.setData({

      boXShow:true,
      goIndex: true
      

    })
  },
  
  //获取视频信息
  getVideo(){
    var that = this;
    wx.showLoading({
      title: '加载中'
    })
    wx.request({
      url: app.globalData.ip +'?type=details_shipin', 
      data: {
        id: that.data.videoId
      
      },
      header: {
        'content-type': 'application/json' 
      },
      success: function (res) {
        wx.hideLoading()
        console.log(res)
        WxParse.wxParse('article', 'html', res.data.shipin.content, that, 5);
        that.setData({
          videoMsg: res.data,
          title: res.data.shipin.title
        });
      }
    })
  },
  onReachBottom: function () {
    var that = this
    var off_on = that.data.off_on
    if (off_on == true) {
      return
    }
    off_on = true
    that.data.page++
    that.loadingShow()
    wx.request({
      url: app.globalData.ip +'?type=details_shipin',
      data: {
        id: that.data.videoId,
        page: that.data.page
      },
      header: {
        'content-type': 'application/json' 
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.relevant.length>0){
          var videoLis = that.data.videoMsg;
          for (var i = 0; i < res.data.relevant.length; i++) {
            videoLis.relevant.push(res.data.relevant[i])
          }
          that.setData({
            videoMsg: videoLis,
            off_on: false
          });
        }else{
          that.setData({
            isHide: 'none',
            TostShow: true,
            off_on: true
          });
        }
       
      }
    })
  },
  //播放推荐视频
  goVideo(e) {
    let that = this;
    let videoId = e.currentTarget.dataset.id;
    wx.redirectTo({
      url: 'video?videoId=' + videoId,
    })
  },
  godoctorHomeanswer(e) {
    var doctorId = e.currentTarget.dataset.id
    console.log(e)
    wx.navigateTo({
      url: '../../pages/doctorHomePage/doctorHomePage?doctorId=' + doctorId,
    })
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
  //返回首页
  goidnex(){
    var that = this
    wx.switchTab({
      url: '../index/index',
      // success: function (e) {
      //   var page = getCurrentPages().pop();
      //   if (page == undefined || page == null) return;
      //   page.onLoad();
      // }
    }) 
   
  },
  //点击再次播放
  repPlay(){
    var that = this
    var prevV = wx.createVideoContext('video');
    prevV.play()
    that.setData({
      boXShow: false,
      isplay: true
    })
  },
  //分享页面 
  onShareAppMessage: function () {
    var that = this;
    return{
      title: that.data.title,
      path: '/pages/video/video?videoId=' + that.data.videoId + '&share_query=video',
    }
  },

})