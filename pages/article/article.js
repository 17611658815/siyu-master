//引入js插件
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp()
Page({

  data: {
    articleId:"",//文章id
    articleList:[],//文章内容数组
    page:1,
    TostShow: false,
    isHide: 'none',
    off_on: false,
    title:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that  = this;
    that.setData({
      articleId: options.id,
    })
    that.getArticle()
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
      url: app.globalData.ip +'?type=details_article',
      data: {
        id: that.data.articleId,
        page: that.data.page
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.loadingHide()
        if (res.data.relevant.length>0){
          var list = that.data.articleList;
          for (var i = 0; i < res.data.relevant.length; i++) {
            list.relevant.push(res.data.relevant[i])
          }
          that.setData({
            articleList: list,  //赋值渲染
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
  //获取问答信息
  getArticle() {
    let that = this;
    wx.request({
      url: app.globalData.ip +'?type=details_article',
      data: {
        id: that.data.articleId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        // 模板渲染
        WxParse.wxParse('article', 'html', res.data.article.content, that, 5);
        that.setData({
          articleList: res.data , //赋值渲染
          title: res.data.article.title

        });
      }
    })
  },
  godoctorHomeanswer(e) {
    var doctorId = e.currentTarget.dataset.id
    var num = e.currentTarget.dataset.num
    wx.navigateTo({
      url: '../../pages/doctorHomePage/doctorHomePage?doctorId=' + doctorId,
    })
  },
  //相关问答跳转
  goArticle(e) {
    let that = this;
    let articleId = e.currentTarget.dataset.id;
    wx.redirectTo({
      url: 'article?id=' + articleId,
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
      path: '/pages/article/article?id=' + that.data.articleId + '&share_query=article',
    }
  }

})