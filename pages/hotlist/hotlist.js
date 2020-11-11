//hotlist.js
import "./../../utils/fix";
import _ from "./../../utils/lodash"


//获取应用实例
const app = getApp()

Page({
  data: {
    currentTab: 0,
    list:['哆','来','咪','发','唆','拉','西'],
  },
  onLoad: function () {

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
      url: '/pages/index/index',
    })
  }
  //-----------------end -------------------
})  