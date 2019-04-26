//app.js
const mtjwxsdk = require('./utils/mtj-wx-sdk.js')
App({
  getUserInfo: function() {
    var that = this;
    that.loading();
    if (arguments[0] != undefined) {
      that.globalData.callback = arguments[0];
    }
    var globalData = wx.getStorageSync('globalData') || {};
    var nowtime = new Date().getTime();
    if (globalData.user != undefined &&
      (nowtime - globalData.cachetime) < 3600000 * 24 * 3 &&
      this.globalData.channel == undefined &&
      this.globalData.shareChannel == undefined &&
      this.globalData.fromId == undefined) { //存在用户信息,三天有效期内且无来源渠道
      that.globalData = globalData;
      wx.hideToast();
      if (arguments[0] != undefined) {
        that.globalData.callback = arguments[0];
      }
      //判断回调函数
      if (that.globalData.callback != undefined && typeof(that.globalData.callback) == 'function') {
        that.globalData['callback']();
      }
    } else {
      wx.login({
        success: function(loginCode) {
          //获取用户信息
          wx.getUserInfo({
            success: function(res) { // 当用户授权成功的时候，保存用户的登录信息 
              console.log(loginCode)
              that.globalData.userInfo = res.userInfo;
            
              //接口查询用户openid
              if (that.globalData.userOpen == undefined || that.globalData.userOpen.openid == undefined) {
                that.getOpenid(loginCode);
              }
            },
            fail: function(res) { //用户点了“拒绝” 
              wx.hideToast();
             
              // wx.showModal({ // 向用户提示需要权限才能继续 
              //   title: '提示',
              //   content: '需要授权才能继续此操作，是否重新授权登录?',
              //   success: function(res) {
              //     console.log(res)
              //     if (res.confirm) {
              //       wx.openSetting({
              //         success: function(res) {
              //           that.getUserInfo();
              //         }
              //       })
              //       clearInterval(timer);
              //       wx.navigateTo({
              //         url: '../impower/impower',
              //       })
              //     }
              //   }
              // });
            },
            complete: function(res) {
              console.log('res', res);
            }
          })
        }
      })
    }
  },
  getOpenid: function(loginCode) {
    var that = this;
    //调用request请求api转换登录凭证  
    var appid = that.globalData.appid;
    var secret = that.globalData.secret;
    var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&grant_type=authorization_code&js_code=' + loginCode.code;
    console.log(url);
    wx.request({
      url: 'https://api.mfk.com/app/api/commom.php?para=' + encodeURIComponent(url),
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res)
        that.globalData.userOpen = res.data;
        that.saveUserInfo();
        console.log(res)
      },
      fail: function(res) {
        console.log(res)
      }
    });
  },
  saveUserInfo: function() {
    var that = this;
    wx.request({
      url: 'https://api.mfk.com/app/api/user.php?para=' + encodeURIComponent(JSON.stringify(that.globalData)),
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res)
        that.globalData.user = res.data;
        that.globalData.user.cachetime = new Date().getTime();
        wx.setStorageSync("globalData", that.globalData);
        wx.hideToast();
        // wx.switchTab({
        //   url: '../index/index',
        // }) 
        wx.navigateBack({
          delta: 1
        })
        //判断回调函数
        if (that.globalData.callback != undefined && typeof(that.globalData.callback) == 'function') {
          that.globalData['callback']();
        }
      }
    });
  },
  share: function(path, success = '', fail = '', title = '', imageUrl = '') {
    var option = {};
    var that = this;
    option.path = path;
    option.success = function(res) {
      console.log('分享信息')
      console.log(res)
      // 获取转发详细信息
      if (res.shareTickets != undefined && res.shareTickets[0] != undefined && that.globalData.user != undefined) { //存在用户信息
        that.getShareInfo(res.shareTickets[0], path);
      } else if (that.globalData.user != undefined) { //存在用户信息
        that.saveshare(path);
      }
      //执行成功函数
      if (typeof(success) == 'function') {
        success(res);
      }
    };
    if (typeof(fail) == 'function') {
      option.fail = fail;
    }
    if (imageUrl == '') {
      option.imageUrl = imageUrl;
    }
    option.title = title == '' ? that.globalData.appname : title;
    return option;
  },
  //获取转发详情
  getShareInfo: function(ticket, action) {
    var that = this;
    wx.getShareInfo({
      shareTicket: ticket,
      success(res) {
        var encrypt = res.encryptedData
        var iv = res.iv
        wx.request({
          url: 'https://api.mfk.com/app/api/get_group.php',
          data: {
            encrypt: encrypt,
            iv: iv,
            sessionKey: that.globalData.userOpen.session_key
          },
          success: function(res) {
            var data = JSON.parse(res.data.trim());
            that.globalData.openGid = data.openGId;
            if (typeof(action) == 'string') { //保存分享记录
              that.saveshare(action);
            } else if (typeof(action) == 'function') { //判断回调函数
              action();
            }
          }
        })
      },
      fail() {},
      complete() {}
    });
  },
  //保存转发信息
  saveshare: function(path) {
    var that = this;
    wx.request({
      url: 'https://api.mfk.com/app/api/share.php?appid=' + that.globalData.appid + '&path=' + encodeURIComponent(path) + '&member_id=' + that.globalData.user.id + '&opengid=' + that.globalData.openGid,
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {}
    });
  },
  loading: function() {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
  },
  globalData: {
    appname: '民福康',
    userInfo: {},
    max_callback: 3,
    openGid: '',
    refresh: false,
    appid: 'wxd8fd4122d8ed38e9', //填写微信小程序appid  
    secret: 'e26aba188bb42486413c38c5e5bf9e8e', //填写微信小程序secret
    ip: 'https://api.mfk.com/app/api/mfk_shipin_app2.php',
    user:{}
  },
  //保存引流记录
  saveAttract: function() {
    wx.request({
      url: 'https://api.mfk.com/app/api/discount.php?type=save_share&from_id=' + this.globalData.fromId + '&userid=' + this.globalData.user.id,
    })
  },
  onLaunch: function(option) { //初始化
    var that = this;
    var user = wx.getStorageSync('globalData') || null
    that.globalData.shareChannel = (option.query.shareChannel != undefined) ? option.query.shareChannel : 0;
    if (option.shareTicket != undefined) {
      that.globalData.shareTicket = option.shareTicket;
    }
    if (option.query.userid != undefined) {
      that.globalData.fromId = option.query.userid;
      if (that.globalData.user == undefined) {
        that.getUserInfo(that.saveAttract);
      } else {
        that.saveAttract();
      }
    } else {
      // if (that.globalData.user == undefined) {
      //   that.getUserInfo();
      // }
    }
    console.log(user)
    var timer = setInterval(function () {
    var user = wx.getStorageSync('globalData') || null
      console.log(user)
      if (user!= undefined) {
        clearInterval(timer);

      }else{
        console.log(11111)
        clearInterval(timer);
        wx.navigateTo({
          url: '../impower/impower',
        })
        clearInterval(timer);
      }
    }, 2000);
  },
})