//hotlist.js
import "./../../utils/fix";
import _ from "./../../utils/lodash"


//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    currentTab: 0,
    list:['哆','来','咪','发','唆','拉','西'],
    isShowTextareaModal: false,
  },
  onLoad: function () {
    console.log(app,1111111111111111111111111)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log(res,22222222222222)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          console.log(res,22222222222222222222222222222)
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onShareAppMessage: function(e){

  },
  //-----------------start------------------
  changeTab: function(e){
    const { currentTab } = this.data;
    let item = e.currentTarget.dataset.item;
    if(item !== currentTab){
        this.setData({ currentTab: item });
    }
  },
  navToDetail: function(){
    wx.navigateTo({
      url: '/pages/forumList/forumList',
    })
  },
  showTextareaModal: function(){
    this.setData({isShowTextareaModal:true})
  },
  changeText: function(){

  },
  stopCancelModal: function(){

  },
  cancelModal: function(){
    this.setData({isShowTextareaModal:false})
  },
  risingTone: function(){

  },
  //-----------------end -------------------
})  