// pages/feedback/feedback.js
var app = getApp();
Page({
  data: {
    imgs: [],//本地图片地址数组
    message: '',
    submitTime: 1,
    userid: '',
    tempFilePaths: {},//本地图片地址对象
    canChoose: true,//是否可选图片
    imgString: '',//图片拼接后的字符串
  },
  onLoad: function (options) {
    var that = this;
    var user = wx.getStorageSync('globalData') || null
    var userid = (user.user.id != undefined) ? user.user.id : 0;
    console.log(userid)
    that.setData({
      userid: userid,
    });
  },
  savemessage: function (e) {
    var that = this;
    that.setData({
      message: e.detail.value
    })
  },
  chooseImageTap: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#00000",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera')
          }
        }
      }
    })
  },
  noChoose: function () {
    var that = this;
    that.alert("最多只能上传9张哦~")
  },
  // 选取图片
  chooseWxImage: function (type) {
    var that = this;
    var imgsPaths = that.data.imgs;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res);
        var imgsLimit = [];
        var tempFilePaths = that.data.tempFilePaths;
        var imgs = that.data.imgs;
        console.log(res.tempFilePaths);
        for (var i = 0; i < res.tempFilePaths.length; i++) {
          tempFilePaths[res.tempFilePaths[i]] = '';
          console.log(res.tempFilePaths[i])
          imgs.push(res.tempFilePaths[i]);
        };
        if (imgs.length > 9) {
          for (var i = 0; i < 9; i++) {
            imgsLimit.push(imgs[i]);
          }
          that.setData({
            imgs: imgsLimit,
            tempFilePaths: tempFilePaths,
          });
        } else {
          that.setData({
            imgs: imgs,
            tempFilePaths: tempFilePaths,
          });
        }
        if (imgsPaths.length >= 9) {
          that.setData({
            canChoose: false,
          });
        } else {
          that.setData({
            canChoose: true,
          });
        };
      },
    })
  },
  upImgs: function (imgurl, index) {
    var that = this;
    that.loading();
    wx.uploadFile({
      url: app.globalData.ip +'?type=uppic&uid=' + that.data.userid,
      filePath: imgurl,
      name: 'file',
      header: {
        'content-type': 'multipart/form-data'
      }, // 设置请求的 header
      formData: null, // HTTP 请求中其他额外的 form data
      success: function (res) {
        var data = JSON.parse(res.data)
        console.log(data);
        if (data['res'] == true) {
          that.data.tempFilePaths[imgurl] = data['msg'];
          index++;
          if (that.data.imgs[index] != undefined) {//存在下一张
            that.upImgs(that.data.imgs[index], index);
          } else {//提交留言
            that.upMessage();
          }
        } else {
          console.log(data['msg']);
        }
        wx.hideToast();
      },
      fail: function (res) {
      },
    })
  },
  checkMessage: function (message) {
    var that = this;
    if (message.length == 0) {
      that.alert("您还没有输入内容哦！");
      that.setData({
        submitTime: 1,
      });
      return false;
    }
    return true;
  },
  submitMessage: function () {
    var that = this;
    var imgsPaths = that.data.imgs;
    var message = that.data.message;
    if (imgsPaths.length > 9) {
      that.alert('最多只能上传9张图片哦~')
    } else if (that.checkMessage(message)) {
      that.setData({
        submitTime: 0,
      });
      that.loading();
      if (imgsPaths.length > 0) {
        that.upImgs(imgsPaths[0], 0);
      } else {
        that.upMessage();
      }
    };
  },
  upMessage: function () {
    var that = this;
    console.log(123);
    console.log(that.data.tempFilePaths);
    that.loading();
    var imgStrings = that.data.tempFilePaths;
    var imgString = that.data.imgString;
    for (var i in imgStrings) {
      imgString += imgStrings[i] + ','
    }
    that.setData({
      imgString: imgString,
    })
    console.log(that.data.imgString);
    wx.request({
      url: app.globalData.ip +'?type=message&uid=' + that.data.userid + '&message=' + that.data.message + '&images=' + that.data.imgString,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.res == 'false') {
          that.alert(res.data.msg);
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            success: function () {
              wx.navigateBack({
                delta: 1,
              })
            }
          })
        }
      },
      complete: function () {// complete
        wx.hideToast();
      }
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
  loading: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
  },
  onShareAppMessage: function () {
    var that = this;
    return app.share(
      '/pages/index/index?shareChannel=' + that.data.userid,
    );
  },
})