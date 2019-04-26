// pages/searchPage/searchPage.js
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: ['综合', '疾病', '专家', '视频','问答', '文章', '音频'],
    currentTab: 0,
    illnessList:[],
    pageChange: true,
    searchMsg: "",
    searchHomeList: [], //搜索主页列表
    searchHomeLists: [],
    hotList: [],
    page:1,
    TostShow: false,
    isHide: 'none',
    off_on: false,
    searchRecord: wx.getStorageSync('searchRecord') ? wx.getStorageSync('searchRecord') : []
  },
  onLoad(options) {
    let that = this
    console.log(options)

    that.hotIllness()
    that.openHistorySearch()
  },
  openHistorySearch: function () {
    var that = this
    that.setData({
      searchRecord: wx.getStorageSync('searchRecord') || [],//若无储存则为空
    })
  },
  onShow() {
    this.hotIllness()
    this.openHistorySearch()
  },
  //搜索内容
  searchMsgs(e) {
    var that = this;
    console.log(e)
    that.setData({
      searchMsg: e.detail.value 
    })
    if (e.detail.value.length>0){
      wx.request({
        url: app.globalData.ip + '?type=hot_key&q=' + that.data.searchMsg,
        header: {
          'content-type': 'application/json'
        },
        method: 'GET',
        success: function (res) {
          console.log(res.data.ad)
          that.setData({
            illnessList: res.data.ad
          })
        }
      })
    }
    
    if (e.detail.value.length == 0){
      that.setData({
        illnessList: []
      })
    }
    
  },
  //热搜词
  hotIllness() {
    let that = this
    wx.request({
      url: app.globalData.ip +'?type=hot_key',
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function(res) {
        console.log(res.data.ad)
        that.setData({
          hotList: res.data.ad
        })
      }
    })
  },
  searchHot(e) {
    console.log()
    var that = this
    that.setData({
       searchMsg:e.currentTarget.dataset.value
    })
    that.addStoage()
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.ip +'?type=search_home&q=' + that.data.searchMsg,
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function(res) {
        that.setData({
          searchHomeLists: res.data,
          pageChange: false
        })
        wx.hideLoading()
      }
    })
  },
  searchHot2(e) {
    let that = this
    that.setData({
      searchMsg: e.currentTarget.dataset.value
    })
    console.log(e)
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.ip + '?type=search_home&q=' + that.data.searchMsg,
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          searchHomeLists: res.data,
          pageChange: false
        })
        wx.hideLoading()
      }
    })
  },
  //下拉加载
  onReachBottom: function() {
    let that = this
    that.data.page++
    if (that.data.currentTab == 1) {  //疾病列表
      that.illnessPull()
    } else if (that.data.currentTab == 2) { //医生列表
      that.doctorPull()
    } else if (that.data.currentTab == 3) { //视频列表
      that.videoPull() 
    } else if (that.data.currentTab == 4) { //问答列表
      that.askPull()
    } else if (that.data.currentTab == 5) { //文章列表
      that.articlePull()
    } else if (that.data.currentTab == 6) { //音频列表
      that.audioPull()
    }

  },
  //综合数据
  searchIllness(url) {
    let that = this
    that.addStoage()
    console.log(that.data.searchMsg == '')
    if (that.data.searchMsg == ''){
      that.alert('搜索内容不能为空！')
      return
    }
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.ip +'?type=search_home&q=' + that.data.searchMsg,
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        console.log(res)
        that.setData({
          searchHomeLists: res.data,
          pageChange: false
        })
        console.log(that.data.searchHomeLists)
        wx.hideLoading()
      }
    })
  },
  //历史记录
  addStoage(){
    var that = this
    var searchRecord = wx.getStorageSync('searchRecord') || []
    if (that.data.searchMsg == '') {
      return
    }
    else {
      //将搜索值放入历史记录中,只能放前五条
      console.log(that.data.searchMsg, searchRecord, searchRecord.indexOf(that.data.searchMsg))
      console.log(searchRecord.length)
      if (searchRecord.length < 10 && searchRecord.indexOf(that.data.searchMsg) == -1) {
        searchRecord.unshift(
            that.data.searchMsg,
        )
      }
      else if (searchRecord.length == 10){
        searchRecord.pop()//删掉旧的时间最早的第一条
        searchRecord.unshift(
           that.data.searchMsg,
        )
      }
      wx.setStorageSync('searchRecord', searchRecord)
    }
  },
  //删除历史记录
  historyDelFn: function () {

    wx.removeStorage({
      key: 'searchRecord'
    })
    this.setData({
      searchRecord:[]
    })
  },
  //疾病列表
  illnessPull(){
    let that = this
    var off_on = that.data.off_on
    if (off_on == true) {
      return
    }
    off_on = true
    that.loadingShow()
    wx.request({
      url: app.globalData.ip +'?type=search_illness&q=' + that.data.searchMsg + "&page=" + that.data.page,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.loadingHide()
        var searchHomeList = that.data.searchHomeList;
        if (res.data.illness.length>0){
          for (var i = 0; i < res.data.illness.length; i++) {
            searchHomeList.illness.push(res.data.illness[i])
          }
          that.setData({
            searchHomeList: searchHomeList,
            off_on: false
          });
        }else{
          that.setData({
            isHide: 'none',
            TostShow: true,
            off_on: true
          });
        }
        wx.hideLoading()
      }
    })
  },
  //医生列表
  doctorPull(){
    let that = this
    var off_on = that.data.off_on
    if (off_on == true) {
      return
    }
    off_on = true
    that.loadingShow()
    wx.request({
      url: app.globalData.ip +'?type=search_doctor&q=' + that.data.searchMsg + "&page=" + that.data.page,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.loadingHide()
        if (res.data.doctor.length>0){
          var searchHomeList = that.data.searchHomeList;
          for (var i = 0; i < res.data.doctor.length; i++) {
            searchHomeList.doctor.push(res.data.doctor[i])
          }
          that.setData({
            searchHomeList: searchHomeList,
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
  //视频列表
  videoPull(){
    let that = this
    var off_on = that.data.off_on
    if (off_on == true) {
      return
    }
    off_on = true
    that.loadingShow()
    wx.request({
      url: app.globalData.ip +'?type=search_shipin&q=' + that.data.searchMsg + "&page=" + that.data.page,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.loadingHide()
        if (res.data.shipin.length>0){
          var searchHomeList = that.data.searchHomeList;
          for (var i = 0; i < res.data.shipin.length; i++) {
            searchHomeList.shipin.push(res.data.shipin[i])
          }
          that.setData({
            searchHomeList: searchHomeList,
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
  //问答列表
  askPull(){
    let that = this
    var off_on = that.data.off_on
    if (off_on == true) {
      return
    }
    off_on = true
    that.loadingShow()
    wx.request({
      url: app.globalData.ip +'?type=search_ask&q=' + that.data.searchMsg + "&page=" + that.data.page,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.loadingHide()
        if (res.data.ask.length>0){
          var searchHomeList = that.data.searchHomeList;
          for (var i = 0; i < res.data.ask.length; i++) {
            searchHomeList.ask.push(res.data.ask[i])
          }
          that.setData({
            searchHomeList: searchHomeList,
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
  //文章列表
  articlePull(){
    let that = this
    var off_on = that.data.off_on
    if (off_on == true) {
      return
    }
    off_on = true
    that.loadingShow()
    wx.request({
      url: app.globalData.ip +'?type=search_article&q=' + that.data.searchMsg + "&page=" + that.data.page,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.loadingHide()
        if (res.data.article.length>0){
          var searchHomeList = that.data.searchHomeList;
          for (var i = 0; i < res.data.article.length; i++) {
            searchHomeList.article.push(res.data.article[i])
          }
          that.setData({
            searchHomeList: searchHomeList,
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
  //音频列表
  audioPull(){
    let that = this
    var off_on = that.data.off_on
    if (off_on == true) {
      return
    }
    off_on = true
    that.loadingShow()
    wx.request({
      url: 'https://api.mfk.com/app/api/mfk_shipin_app2.php?type=search_yinpin&q=' + that.data.searchMsg + "&page=" + that.data.page,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.loadingHide()
        if (res.data.yinpin.length>0){
          var searchHomeList = that.data.searchHomeList;
          for (var i = 0; i < res.data.yinpin.length; i++) {
            searchHomeList.yinpin.push(res.data.yinpin[i])
          }
          that.setData({
            searchHomeList: searchHomeList,
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
  //tab切换请求数据
  tabMsg(url) {
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function(res) {
        console.log(res)
        that.setData({
          searchHomeList: res.data,
          pageChange: false,
          page:1
        })
        wx.hideLoading()
      }
    })
  },
  //tab切换
  swichNav: function(e) {
    let that = this;
    console.log(e.currentTarget.dataset.current)
    that.setData({
      currentTab: e.currentTarget.dataset.current,
      off_on: false,
      TostShow: false,
      page: 1
    });
    if (that.data.currentTab == 0) {
      var url = 'https://api.mfk.com/app/api/mfk_shipin_app2.php?type=search_home&q=' + that.data.searchMsg
      that.searchIllness(url)
    } else if (that.data.currentTab == 1) {
      var url = 'https://api.mfk.com/app/api/mfk_shipin_app2.php?type=search_illness&q=' + that.data.searchMsg
      that.tabMsg(url)
    } else if (that.data.currentTab == 2) {
      var url = 'https://api.mfk.com/app/api/mfk_shipin_app2.php?type=search_doctor&q=' + that.data.searchMsg
      that.tabMsg(url)
    } else if (that.data.currentTab == 3) {
      var url = 'https://api.mfk.com/app/api/mfk_shipin_app2.php?type=search_shipin&q=' + that.data.searchMsg
      that.tabMsg(url)
    } else if (that.data.currentTab == 4) {
      var url = 'https://api.mfk.com/app/api/mfk_shipin_app2.php?type=search_ask&q=' + that.data.searchMsg
      that.tabMsg(url)
    } else if (that.data.currentTab == 5) {
      var url = 'https://api.mfk.com/app/api/mfk_shipin_app2.php?type=search_article&q=' + that.data.searchMsg
      that.tabMsg(url)
    } else {
      var url = 'https://api.mfk.com/app/api/mfk_shipin_app2.php?type=search_yinpin&q=' + that.data.searchMsg
      that.tabMsg(url)
    }
  },
  //更多疾病
  moreIllness() {
    let that = this;
    that.setData({
      currentTab: 1
    });
    var url = 'https://api.mfk.com/app/api/mfk_shipin_app2.php?type=search_illness&q=' + that.data.searchMsg
    that.tabMsg(url)
  },
  //更多医生
  moreDoctor() {
    let that = this;
    that.setData({
      currentTab: 2
    });
    var url = 'https://api.mfk.com/app/api/mfk_shipin_app2.php?type=search_doctor&q=' + that.data.searchMsg
    that.tabMsg(url)
  },
  //更多视频
  moreVideo() {
    let that = this;
    that.setData({
      currentTab: 3
    });
    var url = 'https://api.mfk.com/app/api/mfk_shipin_app2.php?type=search_shipin&q=' + that.data.searchMsg
    that.tabMsg(url)
  },
  //更多问答
  moreAsk() {
    let that = this;
    that.setData({
      currentTab: 4
    });
    var url = 'https://api.mfk.com/app/api/mfk_shipin_app2.php?type=search_ask&q=' + that.data.searchMsg
    that.tabMsg(url)
  },
  //更多文章
  moreArticle() {
    let that = this;
    that.setData({
      currentTab: 5
    });
    var url = 'https://api.mfk.com/app/api/mfk_shipin_app2.php?type=search_article&q=' + that.data.searchMsg
    that.tabMsg(url)
  },
  //更多音频
  moreAudio() {
    let that = this;
    that.setData({
      currentTab: 6
    });
    var url = 'https://api.mfk.com/app/api/mfk_shipin_app2.php?type=search_yinpin&q=' + that.data.searchMsg
    that.tabMsg(url)
  },
  //疾病详情
  goToillness(e) {
    var that = this;
  
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    that.setData({
      searchMsg: name
    })
    that.addStoage()
    wx.navigateTo({
      url: "../../pages/disease/disease?diseaseId=" + id + '&name=' + name,
    });
  },
  //疾病详情
  goToillness2(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: "../../pages/disease/disease?diseaseId=" + id + '&name=' + name,
    });
  },
  //医生主页
  goTodoctor(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: "../../pages/doctorHomePage/doctorHomePage?doctorId=" + id,
    });
  },
  //视频主页
  goToVideo(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: "../../pages/video/video?videoId=" + id,
    });
  },
  //问答页面
  goToAsk(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: "../../pages/answer/answer?id=" + id,
    });
  },
  //文章详情
  goToArticle(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: "../../pages/article/article?id=" + id,
    });
  },
  //音频详情
  goToAudio(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: "../../pages/audio/audio?id=" + id,
    });
  },
  alert(content) {
    wx.showModal({
      title: '提示',
      content: content,
      showCancel: false
    })
    return this
  },
  //分享页面 
  // onShareAppMessage: function () {
  //   var that = this;
  //     return app.share(
  //       '/pages/search/search?pageChange='+that.data.pageChange + '&searchMsg=' + that.data.searchMsg,
  //     );
  // },
})