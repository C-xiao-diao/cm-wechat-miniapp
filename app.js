//app.js
import { http } from "utils/util";

App({
  onLaunch: function () {
    console.log("执行了onLaunch操作~~")
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    // this._login();
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  onShow: function () {
    console.log(this.globalData.userId)
    console.log("执行了onShow操作")
    this._login();
  },
  // 登录方法
  _login: function () {
    // 登录
    wx.login({
      success: res => {
        console.log("执行了app.js的login操作,并已拿到回调")
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          let cmd = "/api/cWeChat/appletsGetOpenid";
          http.get({
            cmd,
            data: { code: res.code },
            success: res => {
              console.log("已从服务器拿到userId")
              if (res.data.code == 200) {
                var resData = res.data;
                this.globalData.userId = resData.data.weChatUserId;
                this.globalData.openId = resData.data.openid;
                this.globalData.unionid = resData.data.unionid;
                this.globalData.isVip = resData.data.isVip;
                this.globalData.studentId = resData.data.studentId;
                this.globalData.studentName = resData.data.studentName;
                this.globalData.reviewStatus = resData.data.reviewStatus;
                this.globalData.step = resData.data.step;
                let userInfo ={};
                if(resData.data.nickName){
                  userInfo.nickName = resData.data.nickName;
                }
                if(resData.data.sex){
                  userInfo.sex = resData.data.sex;
                }
                if(resData.data.city){
                  userInfo.city = resData.data.city;
                }
                if(resData.data.schoolName){
                  userInfo.schoolName = resData.data.schoolName;
                }
                if(resData.data.schoolId){
                  userInfo.schoolId = resData.data.schoolId;
                }
                if(resData.data.noteNumber){
                  userInfo.noteNumber = resData.data.noteNumber;
                }
                if(resData.data.headimgUrl){
                  userInfo.headimgUrl = resData.data.headimgUrl;
                }
                this.globalData.userInfo = userInfo;
                if (this.loginCallback) {
                  this.loginCallback(resData)
                }
              }
            }
          })
        } else {
          // console.log('登录失败'+res.errMsg);
          wx.showToast({ title: '登录失败!' });
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    userId: "",
    openId: '',
    unionid: "",
    studentId: '',
    isIpx: false,   //适配IPhoneX
    statusBarHeight: 20,
    isConnected: true,
    pixelRatio: 1,
    currentThemeId: '',
  }
})