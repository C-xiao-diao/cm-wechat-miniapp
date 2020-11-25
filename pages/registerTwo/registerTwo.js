//registerTwo.js
Page({
  data: {
    address: '长沙市',
    schoolName: '',
    IDcard: '',
    realName: ''
  },
  onLoad: function () {

  },
  bindPickerChange: function (e) {
    const value = e.detail.value;
    this.setData({ address: value[2] });
  },
  bindSchoolHandle: function (e) {
    let schoolName = e.detail.value;
    this.setData({ schoolName });
  },
  bindIdCardHandle: function (e) {
    let IDcard = e.detail.value;
    this.setData({ IDcard });
  },
  bindRealNameHandle: function (e) {
    let realName = e.detail.value;
    this.setData({ realName });
  },
  //下一步
  registerTwoSubmit: function () {
    const _this = this;
    //提前发起授权
    wx.authorize({
      scope: 'scope.camera',
      success(res) {
        //跳转界面
        wx.navigateTo({
          url: '/pages/auditing/auditing',
        })
      },
      fail(res) {
        _this.openSetting();
      }
    })
  },
  // 前往设置界面
  openSetting: function () {
    const _this = this;
    wx.getSetting({
      success(res) {
        let scope = res.authSetting;
        console.log(scope, 'scopescopescopescopescopescopescope');
        if (!scope['scope.camera']) {
          wx.showModal({
            title: '警告',
            content: '若不授权使用摄像头，将无法使用人脸识别功能！',
            cancelText: '不授权',
            cancelColor: '#1ba9ba',
            confirmText: '授权',
            confirmColor: '#1ba9ba',
            success: (res) => {
              if (res.confirm) {//允许打开授权页面
                //调起客户端小程序设置界面，返回用户设置的操作结果
                wx.openSetting({
                  success: (res) => {
                    res.authSetting = {
                      "scope.camera": true
                    }
                  },
                })
              } else if (res.cancel) {//拒绝打开授权页面
                // wx.navigateBack({ delta: 1 })
              }
            }
          })
        }
      }
    })
  }
})