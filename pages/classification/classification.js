const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userid: '',
    bank: '',
    bankShow: true,
    userName: '',
    toView: 'eeede',
    bankId: '',
    list: ['高血压', '高血压', '高血压', '高血压','高血压'],
    keys: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },

  jumpTo: function (e) {
    // 获取标签元素上自定义的 data-opt 属性的值
    let target = e.currentTarget.dataset.opt;
    this.setData({
      toView: target
    })
  },
  //分享页面 
  onShareAppMessage: function () {
    var that = this;
    return app.share(
      '/pages/classification/classification',
    );
  },
})