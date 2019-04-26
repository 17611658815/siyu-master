// pages/department/department.js
//获取应用实例  
var app = getApp()
Page({
  data: {
    userid:'',
    menuType: [],
    scrollNum: '',
    scrollTop: 0,
    goodHeight: 88,
    firstFloor: wx.getStorageSync('list') ? wx.getStorageSync('list') : [],//疾病列表
    firstIllness: [],
    first:{},
    secend: {},
    hasSecend: false,
    illness: [],
    diseaseId: 0,
    showOrhide: true,//展开或者折叠，false折叠，true展开
    actice:false,
    sonid:'',
  },
  selectMenuAct: function (e) {
    console.log(e)
    var that = this
    var data = e.currentTarget.dataset.id;
    data = data+'';
    data = data.split('-');
    var id = data[0];
    console.log(data)
    var scrollNum = that.data.scrollNum
    scrollNum = id;
    console.log(id != 0 , that.data.scrollNum == id , this.data.showOrhide == true , data[1] == undefined)
    if (id != 0 && that.data.scrollNum == id && this.data.showOrhide == true && data[1]==undefined) {
      that.setData({
        showOrhide: false,
        actice:true
      })
    } else{
      that.splitData(that.data.firstFloor, data);
    }
    that.setData({
      scrollNum: scrollNum,
    })
  },
  onLoad: function (options) {
    var that = this;
    var user = wx.getStorageSync('globalData') || null
    var userid = (user.user.id != undefined) ? user.user.id : 0;
   
    that.setData({
      userid: userid,
    });
    if (options.id!=undefined){
      that.setData({
        scrollNum: options.id,
        userid: options.id
      })
    }
    that.loadList();
  },

  //获取本地存储数据
  getStorage(){
    let that = this
    wx.showLoading({
      title: "加载中",
    })
    if (wx.getStorageSync('list')) {
      var list = wx.getStorageSync('list');
      that.data.firstFloor = list;
      that.splitData(list);
      wx.hideLoading()
    }
    else {
     
    }
  },
  
  loadList: function () {
    var that = this;
    var firstFloor = that.data.firstFloor;
    var menuTid = that.data.menuType;
    wx:wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.ip +'?type=illness_tree',
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        console.log(res)
        var list = res.data;
        that.setData({
          scrollNum: list[1].id
        })
        console.log(list[1].id)
        that.data.firstFloor = list;
        for(var i = 0 ; i<list.length;i++){
          if(list[i].son == undefined){
            list[i].son = [{
              name:list[i].name+"全科",
              id:list[i].id
            }]
          }
        }
        console.log(list)
        that.splitData(list);
       wx.hideLoading()
      },
      complete: function () {// complete
        
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
  //搜索页面
  goToSearch() {
    wx.navigateTo({
      url: '../../pages/search/search',
    });
  },
  goCenter: function () {
    if (app.globalData.user == undefined) {
      app.getUserInfo(function () {
        wx.redirectTo({
          url: '../center/center',
        });
      });
    } else {
      wx.redirectTo({
        url: '../center/center',
      })
    }
  },
  gotodiseaseList: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    console.log(id)
    wx.navigateTo({
      url: "../../pages/disease/disease?diseaseId=" + id+'&name='+name,
    });
    that.setData({
      diseaseId: id
    })
  },
  saveWords: function (e) {
    var that = this;
    that.setData({
      keyWords: e.detail.value
    })
  },
  goSearch: function () {
    var that = this;
    wx.navigateTo({
      url: '../search/search?keywords=' + that.data.keyWords,
      success: function () {
        that.setData({
          keyWords: '',
        })
      }
    })
  },
  //分享页面 
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '民福康-大健康科普知识平台',
      path: '/pages/diseaseList/diseaseList?id=' + that.data.userid
    }
  },
  //拆分数据
  splitData: function (list){
    var that = this;
    var first = {};//科室
    var secend = {};//二级科室
    var hasSecend = false;
    var firstkey = false;
    var showOrhide = true;
    var illness = list[0].illness;  //默认常见疾病列表
    var data = [that.data.scrollNum];
    if(arguments[1]!=undefined){
      var data = arguments[1];
    }
    for (var i = 0; i < list.length; i++) {
      if (first[list[i].id]==undefined){  //默认第一个科室展开
        first[list[i].id] = {};
        if (parseInt(data[0]) == parseInt(list[i].id)){
          first[list[i].id].select = true;
          firstkey = list[i].id;
          illness = list[i].illness;
        }else{
          first[list[i].id].select = false;
        }
        first[list[i].id].hasSecend = list[i].son != undefined;
        console.log(first[list[i].id].hasSecend = list[i].son != undefined)
        first[list[i].id].id = list[i].id;
        first[list[i].id].name = list[i].name;
      }
      if (list[i].son != undefined  && parseInt(firstkey) == parseInt(list[i].id)) {
        hasSecend = true;
        for (var j = 0; j < list[i].son.length; j++) {         
          if (secend[list[i].son[j].id] == undefined) {
            console.log(secend[list[i].son[j].id])
            secend[list[i].son[j].id] = {};
            if (data[1] != undefined && parseInt(data[1]) == parseInt(list[i].son[j].id)) {
              secend[list[i].son[j].id].select = true;
              first[list[i].id].select = true;
              illness = list[i].son[j].illness;
            } else {
              secend[list[i].son[j].id].select = false;
            }
            secend[list[i].son[j].id].id = list[i].son[j].id;
            secend[list[i].son[j].id].name = list[i].son[j].name;
          }
        }
      } else if (list[i].son != undefined && parseInt(firstkey) == parseInt(list[i].id)) {
        var tempSecend = [];
        var tempIllness = [];
        var ishas = false;
        for (var j = 0; j < list[i].son.length; j++) {
          tempSecend[list[i].son[j].id] = {};
          tempSecend[list[i].son[j].id].id = list[i].son[j].id;
          tempSecend[list[i].son[j].id].name = list[i].son[j].name;
          if (parseInt(data[0]) == parseInt(list[i].son[j].id)) {
            ishas = true;
            tempSecend[list[i].son[j].id].select = true;
            tempIllness = list[i].son[j].illness;
          } else {
            tempSecend[list[i].son[j].id].select = false;
          }
        }
        // if (ishas) {
        //   secend = tempSecend;
        //   illness = tempIllness;
        //   hasSecend = true;
        //   first[list[i].id].select = true;
        // }
      }
      
    }
    var setData = {
      first: first,
      secend: secend,
      hasSecend: hasSecend,
      illness: illness,
      showOrhide: true
    };
    if (arguments[1] != undefined) {
      setData.scrollNum = arguments[1];
    }
    that.setData(setData, function () {
    
    })
  },
  goillness(e){
    var that = this
    var id = e.currentTarget.dataset.sonid
    that.setData({
      sonid: id
    })

    wx.navigateTo({
      url: '../../pages/illness/illness?id=' + that.data.sonid,
    })
  }
})