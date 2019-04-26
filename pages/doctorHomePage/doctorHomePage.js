var WxParse = require('../../wxParse/wxParse.js');
const app = getApp()
Page({
  data: {
    list: ['主页', '视频', '文章', '音频'],
    doctorinfos: {}, //医生个人信息
    doctorinfo: {}, //专家视频-音频-文章...列表
    introduction: '',
    currentTab: 0,
    page: 1,
    doctorId: "",
    url: "",
    one: "",
    userid: "",
    show: true,
    focus: true, //默认未关注
    guideShow: true,
    off_on: false,
    fixTop: 500, //区域离顶部的高度 默认五百 防闪动
    scrollTop: 0, //滑动条离顶部的距离
    TostShow: false,
    isHide: 'none',
    fined: false,
    autoHeight: '',
    boXShow: true,
    isplay: false,
    goIndex: false,
    a: true,
    docName: ''
  },
  onLoad: function(options) {
    var that = this
    console.log(options)
    var globalData = app.globalData;
    var user = wx.getStorageSync('globalData') || {}
    var userid = (JSON.stringify(user) != "{}") ? user.user.id : 0;
    var timer = setInterval(function () {
    if (JSON.stringify(user) == "{}"){
      console.log(111)
      wx.navigateTo({
          url: '/pages/impower/impower',
        })
      clearInterval(timer)
    }else{
      clearInterval(timer)
    }
    }, 2000);
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          autoHeight: ((res.windowWidth) / 16) * 9
        });
      }
    });
    
    that.setData({
      currentTab: options.one ? options.one : 0,
      doctorId: options.doctorId,
      userid: userid,
      url: 'https://api.mfk.com/html/mfk_video/index.html?id=' + options.doctorId + '&uid=' + userid + '&one=' + options.one
    })
    //概述列表
    var url = 'https://api.mfk.com/app/api/mfk_shipin_app2.php?type=doctor_home'
    that.getDoctorinfo(url)
    //判断是否关注
    console.log(that.data.currentTab)
    //判断选项
    if (options.one == 1) {
      that.godoctorHomevideo()
    } 
    // else if (options.one == 2) {
    //   that.godoctorHomeanswer()
    // } 
    else if (options.one == 2) {
      that.godoctorHomearticle()
    } else if (options.one == 3) {
      that.godoctorHomeaudio()
    }
    that.gaunzhun()
  },
  bindplay() {
    var taht = this
    taht.setData({
      boXShow: false
    })
  },
  repPlay() {
    var that = this
    var prevV = wx.createVideoContext('video');
    prevV.play()
    that.setData({
      boXShow: false,
      isplay: true
    })
  },
  bindended() {
    var taht = this
    taht.setData({
      boXShow: true,
      goIndex: true
    })
  },
  //下拉加载
  onReachBottom: function() {
    let that = this
    let currentTab = that.data.currentTab
    that.data.page++
      if (currentTab == 1 && that.data.doctorinfos.shipin != undefined) {
        that.videoPull()
      }// else
    // if (currentTab == 2 && that.data.doctorinfos.ask != undefined) {
    //   that.askPull()
    // } 
    else if (currentTab == 2 && that.data.doctorinfos.article != undefined) {
      that.articlePull()
    } else if (currentTab == 3 && that.data.doctorinfos.yinpin != undefined) {
      that.audioPull()
    }


  },
  videoPull() {
    let that = this
    var off_on = that.data.off_on
    if (off_on == true) {
      return
    }
    off_on = true
    that.loadingShow()
    wx.request({
      url: "https://api.mfk.com/app/api/mfk_shipin_app2.php?type=doctor_shipin",
      data: {
        id: that.data.doctorId,
        page: that.data.page
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function(res) {
        that.loadingHide()
        if (res.data.shipin.length > 0) {
          var doctorinfo = that.data.doctorinfo
          for (var i = 0; i < res.data.shipin.length; i++) {
            doctorinfo.shipin.push(res.data.shipin[i])
          }
          that.setData({
            doctorinfo: doctorinfo,
            off_on: false
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
  askPull() {
    let that = this
    var off_on = that.data.off_on
    if (off_on == true) {
      return
    }
    off_on = true
    that.loadingShow()
    wx.request({
      url: "https://api.mfk.com/app/api/mfk_shipin_app2.php?type=doctor_ask",
      data: {
        id: that.data.doctorId,
        page: that.data.page
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function(res) {
        that.loadingHide()
        if (res.data.ask.length > 0) {
          var doctorinfo = that.data.doctorinfo
          for (var i = 0; i < res.data.ask.length; i++) {
            doctorinfo.ask.push(res.data.ask[i])
          }
          that.setData({
            doctorinfo: doctorinfo,
            off_on: false
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
  articlePull() {
    let that = this
    var off_on = that.data.off_on
    if (off_on == true) {
      return
    }
    off_on = true
    that.loadingShow()
    wx.request({
      url: "https://api.mfk.com/app/api/mfk_shipin_app2.php?type=doctor_article",
      data: {
        id: that.data.doctorId,
        page: that.data.page
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function(res) {
        that.loadingHide()
        if (res.data.article.length > 0) {
          var doctorinfo = that.data.doctorinfo
          for (var i = 0; i < res.data.article.length; i++) {
            doctorinfo.article.push(res.data.article[i])
          }
          that.setData({
            doctorinfo: doctorinfo,
            off_on: false
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
  audioPull() {
    let that = this
    var off_on = that.data.off_on
    if (off_on == true) {
      return
    }
    off_on = true
    that.loadingShow()
    wx.request({
      url: "https://api.mfk.com/app/api/mfk_shipin_app2.php?type=doctor_yinpin",
      data: {
        id: that.data.doctorId,
        page: that.data.page
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function(res) {
        that.loadingHide()
        if (res.data.yinpin.length > 0) {
          var doctorinfo = that.data.doctorinfo
          for (var i = 0; i < res.data.yinpin.length; i++) {
            doctorinfo.yinpin.push(res.data.yinpin[i])
          }
          that.setData({
            doctorinfo: doctorinfo,
            off_on: false
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
  //默认渲染数据
  getDoctorinfo(url) {
    let that = this
    var page = that.data.page;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: url,
      data: {
        id: that.data.doctorId,
        page: that.data.page
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function(res) {
        console.log(res.data)
        that.setData({
          doctorinfos: res.data,
          introduction: res.data.doctor.introduction.slice(0, 40),
          adept: res.data.doctor.adept.slice(0, 40),
          a: true,
          docName: res.data.doctor.name
        });
        wx.hideLoading()
      }
    })
  },
  //动态请求
  tabList(url) {
    let that = this
    var page = that.data.page;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: url,
      data: {
        id: that.data.doctorId,
        page: page
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function(res) {
        console.log(res)
        wx.hideLoading()
        that.setData({
          doctorinfo: res.data
        })
      }
    })
  },
  //tab切换请求数据
  swichNav: function(e) {
    let that = this;
    console.log(e.currentTarget.dataset.current)
    that.setData({
      currentTab: e.currentTarget.dataset.current,
      TostShow: false,
      off_on: false,
      page: 1,
    });
    if (e.currentTarget.dataset.current == 0) {
      var url = 'https://api.mfk.com/app/api/mfk_shipin_app2.php?type=doctor_home' //概述
      that.getDoctorinfo(url);
    } else if (e.currentTarget.dataset.current == 1) {
      var url = "https://api.mfk.com/app/api/mfk_shipin_app2.php?type=doctor_shipin" //视频
      that.tabList(url);
    } 
   // else if (e.currentTarget.dataset.current == 2) {
    //   var url = "https://api.mfk.com/app/api/mfk_shipin_app2.php?type=doctor_ask" //回答
    //   that.tabList(url);
    // } 
    else if (e.currentTarget.dataset.current == 2) {
      var url = "https://api.mfk.com/app/api/mfk_shipin_app2.php?type=doctor_article" //文章
      that.tabList(url);
    } else {
      var url = "https://api.mfk.com/app/api/mfk_shipin_app2.php?type=doctor_yinpin" //音频
      that.tabList(url);
    }
  },

  //顶部吸附效果
  onShow: function() {
    let self = this;
    wx.createSelectorQuery().select('#list').boundingClientRect(function(rect) {
      self.setData({
        fixTop: rect.top
      })
      console.log(rect.top)
    }).exec()
  },
  onPageScroll: function(e) {
    var that = this
    that.setData({
      scrollTop: e.scrollTop
    })
    if (that.data.fixTop < e.scrollTop) {
      that.setData({
        fined: true
      })
    } else {
      that.setData({
        fined: false,
        fixTop: 500, //区域离顶部的高度
        scrollTop: 0, //滑动条离顶部的距离
      })
    }
  },
  //关注
  onfocus() {
    let that = this;
    wx.request({
      url: "https://api.mfk.com/app/api/mfk_shipin_app2.php?type=set_collection&id=" + that.data.userid + "&doctor=" + that.data.doctorId,
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function(res) {
        that.setData({
          focus: false
        })
      }
    })
  },
  //取消关注
  nofocus() {
    let that = this;
    wx.request({
      url: "https://api.mfk.com/app/api/mfk_shipin_app2.php?type=del_collection&id=" + that.data.userid + "&doctor=" + that.data.doctorId,
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function(res) {
        that.setData({
          focus: true
        })
      }
    })

  },
  //验证是否关注
  gaunzhun() {
    let that = this;
    wx.request({
      url: "https://api.mfk.com/app/api/mfk_shipin_app2.php?type=check_collection&id=" + that.data.userid + "&doctor=" + that.data.doctorId,
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function(res) {
        if (res.data.res == true) {
          that.setData({
            focus: false
          })
        } else {
          that.setData({
            focus: true
          })
        }
      }
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
  //展开收起
  unfold() {
    this.setData({
      show: false,
      wrap: 'wrap'
    })
  },
  //收起
  packUp() {
    this.setData({
      show: true,
      wrap: 'nowrap'
    })
  },
  //擅长疾病展开
  guideUnfold() {
    this.setData({
      guideShow: false
    })
  },
  //擅长疾病收起
  guidePackUp() {
    this.setData({
      guideShow: true
    })
  },
  //更多视频
  godoctorHomevideo() {
    let that = this;
    that.setData({
      currentTab: 1
    })
    var url = "https://api.mfk.com/app/api/mfk_shipin_app2.php?type=doctor_shipin" //视频
    that.tabList(url);
  },
  // //更多问答
  // godoctorHomeanswer() {
  //   let that = this;
  //   that.setData({
  //     currentTab: 2
  //   })
  //   var url = "https://api.mfk.com/app/api/mfk_shipin_app2.php?type=doctor_ask" //回答
  //   that.tabList(url);
  // },
  //更多文章
  godoctorHomearticle() {
    let that = this;
    that.setData({
      currentTab: 2
    })
    var url = "https://api.mfk.com/app/api/mfk_shipin_app2.php?type=doctor_article" //文章
    that.tabList(url);
  },
  //更多音频
  godoctorHomeaudio() {
    let that = this;
    that.setData({
      currentTab: 3
    })
    var url = "https://api.mfk.com/app/api/mfk_shipin_app2.php?type=doctor_yinpin" //音频
    that.tabList(url);
  },
  onShareAppMessage: function() {
    var that = this;
    return {
      title: '民福康-' + that.data.docName + '医生',
      path: '/pages/doctorHomePage/doctorHomePage?doctorId=' + that.data.doctorId + '&share_query=doctorHomePage',
    }
  },
  //视频-音频-文章-问答详情
  goToDetails(e) {
    console.log(e)
    let id = e.currentTarget.dataset.id
    let classes = e.currentTarget.dataset.class
    if (classes == 1) {
      wx.navigateTo({
        url: '../../pages/video/video?videoId=' + id, //视频详情
      });
    } else if (classes == 2) {
      wx.navigateTo({
        url: '../../pages/answer/answer?id=' + id, //问答详情
      });
    } else if (classes == 3) {
      wx.navigateTo({
        url: '../../pages/article/article?id=' + id, //文章详情
      });
    } else {
      wx.navigateTo({
        url: '../../pages/audio/audio?id=' + id, //音频详情
      });
    }
  },
  loading: function() {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
  },
  //返回首页
  goidnex() {
    var that = this
    wx.switchTab({
      url: '../index/index',
    })

  },
})