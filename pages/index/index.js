//hotlist.js
import "./../../utils/fix";
import _ from "./../../utils/lodash"
import { http } from "./../../utils/util";

//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    currentTab: 0,
    listHot: ['哆', '来', '咪', '发', '唆', '拉', '西'],
    listRandom: [],
    isShowTextareaModal: false,
    // 是否显示用户信息授权按钮
    isShowUserInfoBtn: true,
    //起个调的主题
    theme: "",
  },
  onLoad: function () {
    console.log(app, 'app.globalDataapp.globalDataapp.globalData',this.data.canIUse)
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse) {
    //   console.log('接到了app的回调1111111111111111111111111111111', app)
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     console.log(res,'接到了app的回调222222222222222222222222222222')
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
    
    //app.js登录后需要执行的 callback 写在此处
    app.loginCallback = resData =>{
      if(_.get(resData, 'code') === 200){
        this.getIndexList(this.data.currentTab, false);
      } else {
        //没有拿到wx.login的回调
      }
    }
  },
  onShow: function () {
    //注意，主页 onLoad可能提前于 小程序 onLaunch 执行完， 
    // 用户id 在onLaunch 的login里获取，所以 首页加载数据，要么 写在 onShow里，要么写在onLoad的 callback回调里
    let _this = this;
    wx.getSetting({
      withSubscriptions: true,
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          _this.setData({ isShowUserInfoBtn: false });
        }
      }
    })
  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  //登录接口
  userInfoHandler: function (e) {
    if(!_.isEmpty(e.detail.userInfo)){
      app.globalData.userInfo = e.detail.userInfo;
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true,
        isShowUserInfoBtn: false
      })
      if(app.globalData.userId){
        this.updateUserInfoTosServer(e.detail.userInfo, e.detail.iv, e.detail.encryptedData)
      } else {
        //根据微信文档，app.js里的 wx.login 的返回不一定在首页 index.js 生命周期前返回，这里做一个容错，如果拿不到、//userId，则再去登录一遍
        this._login(e.detail.userInfo, e.detail.iv, e.detail.encryptedData);
      }
    } else {
      
    }
  },
  //登录

  _login:function(userInfo, iv, encryptedData){
    var that = this;
    wx.login({
      success (res) {
        if (res.code) {
          let cmd = "/api/cWeChat/appletsGetOpenid";
          http.get({
            cmd,
            data:{code: res.code},
            success: res => {
              if (_.get(res, 'data.code') === 200 && !_.isEmpty(_.get(res, 'data.data'))) {
                var resData = res.data;
                app.globalData.userId = resData.data.weChatUserId;
                app.globalData.openId = resData.data.openid;
                app.globalData.unionid = resData.data.unionid;
                app.globalData.studentId = resData.data.studentId;
                app.globalData.isVip = resData.data.isVip;
                that.updateUserInfoTosServer(userInfo, iv, encryptedData)
              }
            }
          })
        }else {
          // console.log('登录失败'+res.errMsg);
          wx.showToast({title: '登录失败!'});
        }
      }
    })
  },

  //修改用户信息
  updateUserInfoTosServer: function (userInfo, iv, encryptedData) {
    let cmd = "/auth/cWechat/editUser";
    let data = {
      openid: app.globalData.openId,
      unionid: app.globalData.unionid,
      studentId: app.globalData.studentId,
      nickname: userInfo.nickName,
      sex: userInfo.gender,
      province: userInfo.province,
      city: userInfo.city,
      country: userInfo.country,
      headimgurl: userInfo.avatarUrl,
      userId: app.globalData.userId,
      iv,
      encryptedData
    };
    http.post({
      cmd,
      data,
      success: res => {
        var resData = res.data;
        if (resData.code == 200 || resData.code == 103) {
          wx.showToast({
            title: '授权成功',
          })
        }
      }
    })
  },


  onShareAppMessage: function (e) {

  },
  //-----------------start------------------
  // 获取首页列表数据
  getIndexList: function(tab, isRandom){
    let currentTab = tab;
    let cmd = "";
    let data = {};
    if(currentTab === 0){
      cmd = "/auth/theme/listHot";
    } else {
      cmd = "/auth/theme/listRandom";
    }
    if(isRandom){
      let listRandom = this.data.listRandom;
      let ids = [];
      for(let i=0;i<listRandom.length;i++){
        ids.push(listRandom[i].id);
      }
      data ={ ids };
    }
    http.get({
      cmd,
      data, 
      success: res =>{
        if(_.get(res, 'data.code') === 200){
          let list = _.get(res, 'data.data.list');
          if(currentTab === 0){
            this.setData({listHot: list, currentTab })
          } else {
            this.setData({listRandom: list, currentTab })
          }
         
        } else {
          wx.showToast({
            title: '请求异常',
          })
        }
      }
    })
  },
  //切换tab页（嗨C、即兴）
  changeTab: function (e) {
    const { currentTab } = this.data;
    console.log(e, 'fffffffffffffffffffffffffffffffffff', currentTab);
    let item = e.currentTarget.dataset.item;
    if (item !== currentTab) {
      // this.setData({ currentTab: item });
      this.getIndexList(item, false)
    }
  },
  //随机刷新 即兴列表
  freestyleHandle: function(){
    this.getIndexList(1, true);
  },
  // 跳转详情
  navToDetail: function (e) {
    let index = e.currentTarget.dataset.index;
    let themeId = e.currentTarget.dataset.themeid;
    //播放音频
    const innerAudioContext = wx.createInnerAudioContext();
    // innerAudioContext.autoplay = true;
    switch (index) {
      case 0:
        innerAudioContext.src = '/audios/duo.m4a';
        break;
      case 1:
        innerAudioContext.src = '/audios/rai.m4a';
        break;
      case 2:
        innerAudioContext.src = '/audios/mi.m4a';
        break;
      case 3:
        innerAudioContext.src = '/audios/fa.m4a';
        break;
      case 4:
        innerAudioContext.src = '/audios/suo.m4a';
        break;
      case 5:
        innerAudioContext.src = '/audios/la.m4a';
        break;
      case 6:
        innerAudioContext.src = '/audios/xi.m4a';
        break;
    }
    innerAudioContext.play();
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    //跳转界面
    wx.navigateTo({
      url: '/pages/forumList/forumList?themeId=' + themeId,
    })
  },
  //显示模态输入框
  showTextareaModal: function () {
    this.setData({ isShowTextareaModal: true })
  },
  // 获取输入框的文字
  changeText: function (e) {
    let theme = e.detail.value;
    if(theme){
      this.setData({theme});
    }
  },
  // 阻止页面事件传递至父元素
  stopCancelModal: function () {

  },
  // 隐藏模态输入框
  cancelModal: function () {
    this.setData({ isShowTextareaModal: false })
  },
  // 起个调
  risingTone: function () {
    const { studentId } = app.globalData;
    const { theme } = this.data;
    if(!theme){
      wx.showToast({
        title: '请先输入内容',
      })
      return;
    }
    let cmd = "/auth/theme/addTheme";
    let data = { publisher: studentId, theme };
    http.post({
      cmd,
      data,
      success: res =>{
        if(_.get(res, 'data.code') === 200){
          wx.showToast({
            title: '操作成功',
          })
          this.setData({ isShowTextareaModal: false })
        }else {
          wx.showToast({
            title: '操作异常，请联系客服',
          })
        }
        console.log(res, "=============================");
      }
    })
  },
  //-----------------end -------------------
})  