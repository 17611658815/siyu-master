//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    tabs: [],
    illnessList: [],
    currentTab: 0, //tab切换默认值
    illnesstab: null, //可是tab样式
    windowHeight: "",
    windowWidth: "",
    keshiId: "", //科室id
    illnessId: "", //疾病id
    homeList: [], //主页页面
    page: 1,
    fixTop: '', //区域离顶部的高度
    scrollTop: 0, //滑动条离顶部的距离
    TostShow: false,
    isHide: 'none',
    off_on: false,
    id:'2'
  },
  //事件处理函
  onLoad: function(option) {
    let that = this;
    var user = wx.getStorageSync('globalData') || null;
    // that.setData({ id: option.id})
    that.hotillness()
    that.loadList()
  },
  onReady: function() {
    this.animation = wx.createAnimation()
  },
  onPageScroll: function(e) {
    var that = this
    that.setData({
      scrollTop: e.scrollTop
    })
  },
  //下拉刷新
  onPullDownRefresh: function() {
    var that = this
    wx.showNavigationBarLoading() //在标题栏中显示加载
    that.onLoad()
    //模拟加载
    setTimeout(function() {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
  //热门疾病
  hotillness() {
    let that = this
    wx.request({
      url: app.globalData.ip + '?type=hot_illness',
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function(res) {
        console.log(res.data)
        that.setData({
          illnessList: res.data.illness
        })
      }
    })
  },

  //获取科室数据
  loadList() {
    let that = this
    var off_on = that.data.off_on
    if (off_on == true) {
      return
    }
    off_on = true
    that.loadingShow()
    wx.request({
      url: 'https://api.mfk.com/app/api/mfk_shipin_app2.php?type=home_list' + "&page=" + that.data.page,
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function(res) {
        that.loadingHide()
        if (res.data.list.length > 0) {
          var list = that.data.homeList
          for (var i = 0; i < res.data.list.length; i++) {
            list.push(res.data.list[i])
          }
          that.setData({
            homeList: list,
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
  //上滑加载
  onReachBottom: function() {
    var that = this;
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

  //搜索页面
  goToSearch() {
    wx.navigateTo({
      url: '../../pages/search/search?pageChange=true',
    });
  },
  //更多疾病列表页面
  goTodiseaseList() {

    wx.navigateTo({
      url: '../../pages/diseaseList/diseaseList',
    });
  },
  //视频-音频-文章-问答-页面
  goToDetails(e) {
    let id = e.currentTarget.dataset.id
    let types = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '../../pages/video/video?videoId=' + id + '&bol=true',
    });
  },
  //科普视频
  goVideohoem() {
    wx.navigateTo({
      url: '../../pages/videohome/videohome',
    });
  },
  //名医问答
  goAskhoem() {
    wx.navigateTo({
      url: '../../pages/askhome/askhome',
    });
  },
  //专家文章
  goArticlehome() {
    wx.navigateTo({
      url: '../../pages/articlehome/articlehome',
    });
  },
  //专家音频
  goAudiohome() {
    wx.navigateTo({
      url: '../../pages/audiohome/audiohome',
    });
  },

  //疾病详情
  goToDisease(e) {
    console.log(e)
    let that = this;
    let id = e.currentTarget.dataset.illnessid
    let name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: '../../pages/disease/disease?diseaseId=' + id + "&name=" + name,
    });
  },
  //获取用户信息
  GotUserInfo() {
    wx.getUserInfo({
      success: function(res) {
        console.log(res)
        app.getUserInfo()
      }
    })
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
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '民福康-大健康科普知识平台',
      path: '/pages/index/index',
    }
  },

})