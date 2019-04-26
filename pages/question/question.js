const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msages:'',
    age:'',
    tel:'',
    message:'',//文本域内容
    Patientage:'',//患者年龄
    PatientTel:'',//患者手机号
    sex: 0,//患者性别
    imgs: [],//本地图片地址数组
    message: '',
    submitTime: 1,
    userid: '',
    tempFilePaths: {},//本地图片地址对象
    canChoose: true,//是否可选图片
    imgString: '',//图片拼接后的字符串
    errorMsg: '',//错误信息
    isHide: 'none',//toast默认隐藏
    radios: [
      {
        label: '1',
        value: '♂男',
      },
      {
        label: '2',
        value: '♀女',
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var userid = (app.globalData.user != undefined) ? app.globalData.user.id : 0;
    // if (userid == 0) {
    //   app.getUserInfo(that.onLoad);
    //   return
    // }
    // console.log(userid)
    that.setData({
      userid: userid,
    })
  },
  //删除上传图片
  reom(e){
    let that = this
    let index = e.currentTarget.dataset.index
    let imgs = that.data.imgs
    for (var i = 0; i < imgs.length;i++){
      if (index == i){
        imgs.splice(i, 1);
        i--;
      }
    }
    that.setData({
      imgs: imgs,
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
    that.alert("最多只能上传6张哦~")
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
        if (imgs.length > 6) {
          for (var i = 0; i < 6; i++) {
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
        if (imgsPaths.length >= 6) {
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
    var PatientTel = that.data.PatientTel;
    var Patientage = that.data.Patientage;
    //手机号正则
    var myreg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
     if(message.length<10){
      that.setData({
        isHide: 'block',
        errorMsg: '请完善病情描述',
      });
      setTimeout(function () {
        that.setData({
          isHide: 'none',
        })
      }, 2000);
      return false;
    }
    else if (imgsPaths.length>6) {
      that.alert('最多只能上传6张图片哦~')
    }
     else if (Patientage=="") {
       that.setData({
         isHide: 'block',
         errorMsg: '请输入您的年龄',
       });
       setTimeout(function () {
         that.setData({
           isHide: 'none',
         })
       }, 2000);
       return false;
     }
     else if (!myreg.test(PatientTel)||PatientTel=="") {
      that.setData({
        isHide: 'block',
        errorMsg: '请输入正确的手机号',
      });
      setTimeout(function () {
        that.setData({
          isHide: 'none',
        })
      }, 2000);
      return false;
    }
    else if (that.checkMessage(message)) {
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
      method: "POST",
      url: app.globalData.ip +'?type=questions',
      data:{
        images: that.data.imgString,
        uid: that.data.userid,
        sex: that.data.sex,
        age: that.data.Patientage,
        mobile: that.data.PatientTel,
        question: that.data.message
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.res == 'false') {
          that.alert(res.data.msg);
        } else {
          wx.showModal({
            content: '您的问题已提交成功,请耐心等待医生问答~',
            confirmText: '继续提问',
            confirmColor: '#666666',
            cancelText: '返回主页',
            cancelColor: '#999999',
            success: function (res) {
              if (res.confirm) {
                that.setData({
                  age: '',
                  tel: '',
                  msages:"",
                  message: '',//文本域内容
                  Patientage: '',//患者年龄
                  PatientTel: '',//患者手机号
                  sex: 0,//患者性别
                  imgs: [],//本地图片地址数组
                  message: '',
                  submitTime: 1,
                  tempFilePaths: {},//本地图片地址对象
                  canChoose: true,//是否可选图片
                  imgString: '',//图片拼接后的字符串
                });
               
              } else if (res.cancel) {
                console.log('返回首页');
                wx.switchTab({
                  url: '../index/index',
                  success: function (e) {
                    var page = getCurrentPages().pop();
                    if (page == undefined || page == null) return;
                    page.onLoad();
                  }
                }) 
              }
            }
          })
        }
      },
      complete: function () {// complete
        wx.hideToast();
      }
    });
  },
  savemessage: function (e) {
    var that = this;
    that.setData({
      message: e.detail.value
    })
  },
  //患者年龄
  Patientage(e) {
    let that = this
    console.log(e)
    var Patientage = e.detail.value
    that.setData({
      Patientage: Patientage,
    });
  },
  //患者手机号
  PatientTel(e) {
    let that = this
    console.log(e)
    var PatientTel = e.detail.value
    that.setData({
      PatientTel: PatientTel,
    });
  },
  //男女单选
  check(e) {
    console.log(e)
    var that = this;
    var sex = e.currentTarget.dataset.index
    that.setData({
      sex: sex
    })
  },
  //健康科普
  goToindex() {
    wx.navigateTo({
      url: '../../pages/index/index',
    });
  },
  //名医精选
  goTodoctorList(){
    wx.navigateTo({
      url: '../../pages/doctorList/doctorList',
    });
  },
  //个人中心
  goTocenter() {
    wx.navigateTo({
      url: '../../pages/center/center',
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
  //分享页面 
  onShareAppMessage: function () {
    var that = this;
    return app.share(
      '/pages/index/index',
    );
  },

})