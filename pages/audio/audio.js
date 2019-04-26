// pages/audio/audio.js
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isOpen: false,//播放开关
    starttime: '00:00', //正在播放时长
    duration: '06:41',   //总时长
    audioId:'',//音频id
    audioList:[],//音频详情渲染数组
    page:1,
    changePlay:false,
    TostShow: false,
    isHide: 'none',
    off_on: false,
    title:''
  },

  onReady: function (e) {
   this.audioCtx = wx.createAudioContext('myAudio')
  },
  onLoad: function (option) {
    let that = this;
   
    that.setData({
      audioId: option.id,
    })
    that.getAudio()
  },
  onReachBottom: function () {
    let that = this
    var off_on = that.data.off_on
    that.data.page++
    if (off_on == true) {
      return
    }
    off_on = true
    that.loadingShow()
    wx.request({
      url: app.globalData.ip +'?type=details_yinpin',
      data: {
        id: that.data.audioId,
        page: that.data.page
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.loadingHide()
        if (res.data.relevant.length>0){
          var list = that.data.audioList;
          for (var i = 0; i < res.data.relevant.length; i++) {
            list.relevant.push(res.data.relevant[i])
          }
          that.setData({
            audioList: list,  //赋值渲染
            off_on: false
          });
        } else {
          that.setData({
            isHide: 'none',
            TostShow: true,
            off_on: true
          });
        }  
      }
    })
  },
  //获取音频信息
  getAudio() {
    let that = this;
    wx.request({
      url: app.globalData.ip +'?type=details_yinpin',
      data: {
        id: that.data.audioId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        WxParse.wxParse('article', 'html', res.data.yinpin.content, that, 5);
        console.log(res.data)
        that.setData({
          audioList: res.data,  //赋值渲染
          title: res.data.yinpin.title
        });
      }
    })
  },
  //相关问答跳转
  goAudio(e) {
    let that = this;
    let audioId = e.currentTarget.dataset.id;
    wx.redirectTo({
      url: 'audio?id=' + audioId,
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
  audioPlay: function () {
    this.setData({
      isOpen: true,
    })
    this.audioCtx.play()
    if (this.data.changePlay == false) {
      wx.showLoading({
        title: '音频加载中...',
      })
    }
  },

  //暂停播放
  audioPause: function () {
    this.setData({
      isOpen: false,
    })
    this.audioCtx.pause()
  },
  //拖动进度条
  sliderChange(e) {
    var offset = parseInt(e.detail.value);
    this.audioPlay()
    this.audioCtx.seek(offset);
  },
  //监听播放时长
  updata(e) {
    var that = this;
    console.log(e.detail.currentTime)
    var offset = parseInt(offset * 100 / duration);
    console.log(offset)
    var duration = e.detail.duration; //总时长
    var offset = e.detail.currentTime;  //当前播放时长
    console.log(offset)
    var currentTime = parseInt(e.detail.currentTime);
    var min = "0" + parseInt(currentTime / 60);
    var max = parseInt(e.detail.duration);
    var sec = currentTime % 60;
    if (sec < 10) {
      sec = "0" + sec;
    };
    var starttime = min + ':' + sec;   /*  00:00  */
    that.setData({
      offset: currentTime,
      starttime: starttime,
      max: max,
      changePlay:true
    })
    console.log(that.data.changePlay)
    if (that.data.changePlay == true){
      wx.hideLoading()
    }
    //判断音频播放结束
    if (offset >= duration) {
      console.log("播放结束")
      that.setData({
        starttime: '00:00', //正在播放时长
        isOpen: false,
        offset: 0
      })
    }
  },
  godoctorHomeanswer(e) {
    var doctorId = e.currentTarget.dataset.id
    var num = e.currentTarget.dataset.num
    wx.navigateTo({
      url: '../../pages/doctorHomePage/doctorHomePage?doctorId=' + doctorId,
    })
  },
  //返回首页
  goidnex() {
    var that = this
    wx.switchTab({
      url: '../index/index',
    })

  },
  //分享页面 
  onShareAppMessage: function () {
    var that = this;
    return {
      title: that.data.title,
      path: '/pages/audio/audio?id=' + that.data.audioId + '&share_query=audio',
    }
  }
 
})