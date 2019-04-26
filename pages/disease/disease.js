// pages/disease/disease.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list:['概述','视频','问答','文章','音频'],//概述也tab切换数组
    lists: ["视频", "问答", "音频", "文章"],//音频-问答-视频...tab数组
    currentTab: 0,//tab切换索引
    overviewList:[],//tab切换列表数组
    attrList:[],//就医指南
    illnessTitle:"",//病情描述
    illnessTitles: "",//展开后病情描述
    illnessName:"",//疾病名称
    illnessId:"",//疾病id
    fixTop: '',//区域离顶部的高度
    scrollTop: 0,//滑动条离顶部的距离
    guideShow: true,//就医指南展开折叠
    show: true,//病情描述展开折叠
    page:1,//页码]
    TostShow: false,
    isHide: 'none',
    off_on: false,
    contype:['home','shipin','ask','article','yinpin'],
    Gdata:{
      home: [],
      shipin: [],
      ask: [],
      article: [],
      yinpin: []
    },
  },
  onLoad: function (options) {
    let that = this;
    //接收传递参数
    var currentTab = that.data.currentTab
   
    that.setData({
      currentTab: options.types ? options.types:0,
      illnessId: options.diseaseId,
      illnessName: options.name,
    })
    if (that.data.currentTab== 0) {
      var url = app.globalData.ip + '?type=illness_home&id=' + that.data.illnessId//概述
      that.loadList(url);
    } else if (that.data.currentTab == 1) {
      var url = app.globalData.ip + "?type=illness_shipin&id=" + that.data.illnessId//视频
      that.tabList(url);
    } else if (that.data.currentTab == 2) {
      var url = app.globalData.ip + "?type=illness_ask&id=" + that.data.illnessId//回答
      that.tabList(url);
    } else if (that.data.currentTab == 3) {
      var url = app.globalData.ip + "?type=illness_article&id=" + that.data.illnessId//文章
      that.tabList(url);
    } else {
      var url = app.globalData.ip + "?type=illness_yinpin&id=" + that.data.illnessId//音频
      that.tabList(url);
    }
    // that.loadList()
    wx.setNavigationBarTitle({
      title: that.data.illnessName//页面标题为路由参数
    })
  },
  //概述列表 
  loadList(url) {
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        // console.log(res.data.yinpin)
        // console.log(that.data.list)
        var list = that.data.list
        // for (var i = 0; i < list.length;i++){
        //   if (res.data.shipin == undefined || res.data.shipin.length == 0) {
        //     list.splice(1, 1);

        //   }
        //   if (res.data.ask == undefined || res.data.ask.length == 0) {
        //     list.splice(2, 1);

        //   }
        //   if (res.data.article == undefined || res.data.article.length == 0) {
        //     list.splice(3, 1);

        //   }
        //   if (res.data.yinpin == undefined || res.data.yinpin.length == 0) {
        //     list.splice(4, 1);

        //   }
        // }
        console.log(res)
        wx.hideLoading()
        that.setData({
          overviewList: res.data, //概述列表
          illnessTitle: res.data.illness.introduction.slice(0, 45),//疾病问题截取
          illnessTitles: res.data.illness.introduction,//完整问题
          attrList: res.data.illness.attr.slice(0, 5), //展开收起截取
          list:list
        })
        
      }
    })
  },
  //上滑加载
  onReachBottom: function () {
    let that = this
    that.data.page++    
    if (that.data.currentTab==1){
      that.pullloadVideo()
    } else if (that.data.currentTab == 2){
      that.pullloadAsk()
    } else if (that.data.currentTab == 3){
      that.pullloadarticle()
    } else if (that.data.currentTab == 4){
      that.pullloAudio()
    }
  },
  //加载视频
  pullloadVideo(){
    let that = this
    var off_on = that.data.off_on
    if (off_on == true) {
      return
    }
    that.loadingShow()
    wx.request({
      url: app.globalData.ip +"?type=illness_shipin&id=" + that.data.illnessId + "&page=" + that.data.page,
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data) 
        that.loadingHide()
        if (res.data.shipin.length>0){
          var overviewList = that.data.overviewList
          for (var i = 0; i < res.data.shipin.length; i++) {
            overviewList.shipin.push(res.data.shipin[i])
          }
          that.setData({
            overviewList: overviewList,
            TostShow: false,
            off_on: false
          })
          console.log(11)
        }else{
          console.log(22)
          that.setData({
            isHide: 'none',
            TostShow: true,
            off_on: true
          })
        }
      }
    })
  },
  // loadList(){
  //   let that = this
  //   var off_on = that.data.off_on
  //   var currentTab = that.data.currentTab
  //   var contype = that.data.contype
  //   var Gdata = that.data.Gdata
  //   if (off_on == true) {
  //     return
  //   }
  //   that.loadingShow()
  //   wx.request({
  //     url: app.globalData.ip + "?type=illness_" + contype[currentTab] + "&id=" + that.data.illnessId + "&page=" + that.data.page,
  //     header: {
  //       'content-type': 'application/json'
  //     },
  //     method: 'GET',
  //     success: function (res) {
  //       console.log(res.data)
  //       console.log(res[contype[currentTab]])
  //       that.loadingHide()
  //       if (res.data.shipin.length > 0) {
  //         var Gdata = that.data.Gdata
  //         var list = res[contype[currentTab]] != undefined ? res[contype[currentTab]] : [];
  //         console.log(res[contype[currentTab]])
  //         for (var i = 0; i < list.length; i++) {
  //           Gdata[contype[currentTab]].push(list[i]);
  //         }
  //         that.setData({
  //           Gdata: Gdata,
  //           TostShow: false,
  //           off_on: false
  //         })
  //       } else {
  //         that.setData({
  //           isHide: 'none',
  //           TostShow: true,
  //           off_on: true
  //         })
  //       }
  //       console.log(Gdata)
  //     }
  //   })
  // },
  //加载问答
  pullloadAsk(){
    let that = this
    var off_on = that.data.off_on
    if (off_on == true) {
      return
    }
    that.loadingShow()
    wx.request({
      url: app.globalData.ip +"?type=illness_ask&id=" + that.data.illnessId + "&page=" + that.data.page,
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        that.loadingHide()
        if (res.data.ask.length>0){
          var overviewList = that.data.overviewList
          for (var i = 0; i < res.data.ask.length; i++) {
            overviewList.ask.push(res.data.ask[i])
          }
          that.setData({
            overviewList: overviewList,//概述列表
            TostShow: false,
            off_on: false
          })
        }else{
          that.setData({
            isHide: 'none',
            TostShow: true,
            off_on: true
          })
        }
      }
    })
  },
  //加载文章
  pullloadarticle(){
    let that = this
    var off_on = that.data.off_on
    if (off_on == true) {
      return
    }
    that.loadingShow()
    wx.request({
      url: app.globalData.ip +"?type=illness_article&id=" + that.data.illnessId + "&page=" + that.data.page,
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        that.loadingHide()
        if (res.data.article.length>0){
          var overviewList = that.data.overviewList
          for (var i = 0; i < res.data.article.length; i++) {
            overviewList.article.push(res.data.article[i])
          }
          that.setData({
            overviewList: overviewList,
            TostShow: false,
            off_on: false
          })
        }else{
          that.setData({
            isHide: 'none',
            TostShow: true,
            off_on: true
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
  //加载音频
  pullloAudio(){
    let that = this
    var off_on = that.data.off_on
    if (off_on == true) {
      return
    }
    that.loadingShow()
    wx.request({
      url: app.globalData.ip +"?type=illness_yinpin&id=" + that.data.illnessId + "&page=" + that.data.page,
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        that.loadingHide()
        if (res.data.yinpin.length>0){
          var overviewList = that.data.overviewList
          for (var i = 0; i < res.data.yinpin.length; i++) {
            overviewList.yinpin.push(res.data.yinpin[i])
          }
          that.setData({
            overviewList: overviewList,
            TostShow: false,
            off_on: false
          })
        }else{
          that.setData({
            isHide: 'none',
            TostShow: true,
            off_on: true
          })
        }
      }
    })
  },
  //tab切换
  swichNav: function (e) {
    let that = this;
    that.setData({
      currentTab: e.currentTarget.dataset.current,
      page:1,
      TostShow: false,
      isHide: 'none',
      off_on: false
    });

    if (e.currentTarget.dataset.current== 0) {
      var url = app.globalData.ip +'?type=illness_home&id='+ that.data.illnessId//概述
      that.loadList(url);
    } else if (e.currentTarget.dataset.current == 1) {
      var url = app.globalData.ip +"?type=illness_shipin&id="+that.data.illnessId//视频
      that.tabList(url);
    } else if (e.currentTarget.dataset.current == 2) {
      var url = app.globalData.ip +"?type=illness_ask&id=" + that.data.illnessId//回答
      that.tabList(url);
    } else if (e.currentTarget.dataset.current == 3) {
      var url = app.globalData.ip +"?type=illness_article&id=" + that.data.illnessId//文章
      that.tabList(url);
    }else{
      var url = app.globalData.ip +"?type=illness_yinpin&id=" + that.data.illnessId//音频
      that.tabList(url);
    }
  },
  godoctorHomePage() {
    wx.navigateTo({
      url: '../../pages/doctorHomePage/doctorHomePage',//跳转医生主页
    })
  },
 
  //视频-音频-问答-文章
  tabList(url){
    let that = this
    // let page = this.data.page
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        wx.hideLoading()
        console.log(res.data)
        that.setData({
          overviewList: res.data,//概述列表
        })
      }
    })
  },
  video(url){
    // let that = this
    // wx.showLoading({
    //   title: '加载中',
    // })
    // wx.request({
    //   url: url,
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   method: 'GET',
    //   success: function (res) {
    //     var overviewList = that.data.overviewList
    //     var list = res.data
    //     for (var i = 0; i <list.length;i++){
    //       overviewList.push(list[i])
    //     }
    //     that.setData({
    //       overviewList: overviewList,//概述列表
    //     })
    //     console.log(that.data.overviewList)
    //     wx.hideLoading()
    //   }
    // })
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
  //指南展开
  guideUnfold() {
    this.setData({
      guideShow: false,
      height: '290px'
    })
  },
  //指南收起
  guidePackUp() {
    this.setData({
      guideShow: true,
      height: '190px'
    })
  },
  //更多视频
  godoctorHomevideo() {
    let that = this;
    that.setData({
      currentTab: 1
    })
    let url = app.globalData.ip +"?type=illness_shipin&id=" + that.data.illnessId
    that.tabList(url);
  },
  //更多问答
  godoctorHomeanswer() {
    let that = this;
    that.setData({
      currentTab: 2
    })
    let url = app.globalData.ip +"?type=illness_ask&id=" + that.data.illnessId
    that.tabList(url);
  },
  //更多文章
  godoctorHomearticle() {
    let that = this;
    that.setData({
      currentTab: 3
    })
    let url = app.globalData.ip +"?type=illness_article&id=" + that.data.illnessId
    that.tabList(url);
  },
  //更多音频
  godoctorHomeaudio() {
    let that = this;
    that.setData({
      currentTab: 4
    })
    let url = app.globalData.ip +"?type=illness_yinpine&id=" + that.data.illnessId
    that.tabList(url);
  },
  //视频-音频-文章-问答-页面
  goToDetails(e) {
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
    } else if (classes== 3) {
      wx.navigateTo({
        url: '../../pages/article/article?id=' + id,//文章详情
      });
    } else {
      wx.navigateTo({
         url: '../../pages/audio/audio?id=' + id,//音频详情
      });
    }
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
      title: '民福康-'+that.data.illnessName ,
      path: '/pages/disease/disease?share_query=disease' + '&diseaseId=' + that.data.illnessId + '&name=' + that.data.illnessName,
    }
  },
 
  
})