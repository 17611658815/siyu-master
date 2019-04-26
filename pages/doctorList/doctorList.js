var app = getApp();
Page({
  data: {
    tabs: [],
    list: ["视频", "问答", "音频", "文章"],
    doctorList: [],
    currentTab: 0,
    windowHeight: "",
    windowWidth: "",
    showflag: false,
    uid: "",
    page: 1,
    values: "",
    TostShow: false,
    isHide: 'none',
    off_on: false,
  },
  onLoad: function(options) {
    var that = this
    that.departmentList() //导航条
    that.getDoctorInfo() //推荐医生
  },
  //初始化默认渲染
  getDoctorInfo() {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.ip + '?type=department_doctor',
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function(res) {
        console.log(res)
        wx.hideLoading()
        that.setData({
          doctorList: res.data.list,
          showflag: true
        })

      }
    })
  },
  //推荐下拉加载
  getPullDoctorInfo() {
    var that = this
    var off_on = that.data.off_on
    if (off_on == true) {
      return
    }
    off_on = true
    that.loadingShow()
    wx.request({
      url: app.globalData.ip + '?type=department_doctor' + "&page=" + that.data.page,
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function(res) {
        that.loadingHide()
        var doctorList = that.data.doctorList;
        if (res.data.list.length > 0) {
          for (var i = 0; i < res.data.list.length; i++) {
            doctorList.push(res.data.list[i])
          }
          that.setData({
            doctorList: doctorList,
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
  //推荐点击事件
  recommend(e) {
    var that = this;
    that.setData({
      currentTab: e.currentTarget.dataset.current,
      TostShow: false,
      page: 1,
      doctorList: [],
      off_on: false
    });
    that.getDoctorInfo()
  },
  onReachBottom: function() {
    let that = this
    that.data.page++
      if (that.data.currentTab == 0) {
        that.getPullDoctorInfo()
      } else {
        that.docutotPull()
      }

  },
  //科室下拉加载
  docutotPull() {
    let that = this
    var off_on = that.data.off_on
    if (off_on == true) {
      return
    }
    off_on = true
    that.loadingShow()
    console.log(that.data.page)
    wx.request({
      url: app.globalData.ip + '?type=department_doctor&id=' + that.data.uid + "&page=" + that.data.page,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res.data)
        that.loadingHide()
        var doctorList = that.data.doctorList;
        if (res.data.list.length > 0) {
          for (var i = 0; i < res.data.list.length; i++) {
            doctorList.push(res.data.list[i])
          }
          that.setData({
            doctorList: doctorList,
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
  //tab样式切换
  swichNav: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id
    that.setData({
      currentTab: e.currentTarget.dataset.current,
      uid: e.currentTarget.dataset.id,
      TostShow: false,
      off_on: false,
      page: 1,
      doctorList: []
    });
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.ip + '?type=department_doctor&id=' + id,
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function(res) {
        wx.hideLoading()
        that.setData({
          doctorList: res.data.list,
        })
      }
    })
  },
  //导航条
  departmentList() {
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.ip + '?type=department_nav',
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function(res) {
        console.log(res)
        wx.hideLoading()
        that.setData({
          tabs: res.data.department
        })
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
  goSearch() {
    let that = this
    var values = that.data.values;
    console.log(that.data.values)
    wx.navigateTo({
      url: '../../pages/search/search?values=' + values, //跳转医生主页
    })
  },
  godoctorHomePage(e) {
    var doctorId = e.currentTarget.dataset.id
    console.log(doctorId)
    wx.navigateTo({
      url: '../../pages/doctorHomePage/doctorHomePage?doctorId=' + doctorId, //跳转医生主页
    })
  },
  //搜索页面
  goToSearch() {
    wx.navigateTo({
      url: '../../pages/search/search',
    });
  },
  //医生详情视频页
  godoctorHomevideo(e) {
    var doctorId = e.currentTarget.dataset.id
    var num = e.currentTarget.dataset.num
    if (num == 0) {
      wx.navigateTo({
        url: '../../pages/doctorHomePage/doctorHomePage?doctorId=' + doctorId + '&one=0',
      })
    } else {
      wx.navigateTo({
        url: '../../pages/doctorHomePage/doctorHomePage?doctorId=' + doctorId + '&one=1',
      })
    }

  },
  // //医生详情回答页
  // godoctorHomeanswer(e) {
  //   var doctorId = e.currentTarget.dataset.id
  //   var num = e.currentTarget.dataset.num
  //   if (num == 0) {
  //     wx.navigateTo({
  //       url: '../../pages/doctorHomePage/doctorHomePage?doctorId=' + doctorId + "&one=0",
  //     })
  //   } else {
  //     wx.navigateTo({
  //       url: '../../pages/doctorHomePage/doctorHomePage?doctorId=' + doctorId + "&one=2",
  //     })
  //   }

  // },
  //医生详情文章页
  godoctorHomearticle(e) {
    var doctorId = e.currentTarget.dataset.id
    var num = e.currentTarget.dataset.num

    if (num == 0) {
      wx.navigateTo({
        url: '../../pages/doctorHomePage/doctorHomePage?doctorId=' + doctorId + "&one=0",
      })
    } else {
      wx.navigateTo({
        url: '../../pages/doctorHomePage/doctorHomePage?doctorId=' + doctorId + "&one=2",
      })
    }

  },
  //医生详情音频页
  godoctorHomeaudio(e) {
    var doctorId = e.currentTarget.dataset.id
    var num = e.currentTarget.dataset.num
    if (num == 0) {
      wx.navigateTo({
        url: '../../pages/doctorHomePage/doctorHomePage?doctorId=' + doctorId + "&one=0",
      })
    } else {
      wx.navigateTo({
        url: '../../pages/doctorHomePage/doctorHomePage?doctorId=' + doctorId + "&one=3",
      })
    }
  },
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '民福康-专家列表',
      path: '/pages/doctorList/doctorList',
    }
  },
})