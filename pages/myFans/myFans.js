//registerOne.js
import { http, isJson } from "./../../utils/util";
import config from "./../../configs/config"
import "./../../utils/fix";
import _ from "./../../utils/lodash"

//获取应用实例
const app = getApp()

Page({
  data: {
    limit: 10,
    page: 0,
    list: [],
  },
  onLoad: function (option) {
    this.getMyFansList();
  },
  //加载我的粉丝列表
  //params {boolean} isMore  是否加载更多
  getMyFansList: function (isMore) {
    let cmd = "/auth/relation/myFansList";
    let { limit, page } = this.data;
    let studentId = app.globalData.studentId;
    let data = { limit, page, studentId };
    http.get({
      cmd,
      data,
      success: res => {
        if (_.get(res, 'data.code') == 200) {
          let list = _.get(res, 'data.data.list');
          this.setData({ list,page: page + 1 });
        } else if (_.get(res, 'data.code') == 107) {
          wx.showModal({
            title: '提示',
            content: _.get(res, 'data.msg') || '暂无数据',
            success(res) {
              if (res.confirm) {
                wx.navigateBack({ delta: 0, })
              } else if (res.cancel) {
                wx.navigateBack({ delta: 0, })
              }
            }
          })
        }
      }
    })
  },
  onReachBottom: function(){
    this.getMyFansList(true)
  }
}) 