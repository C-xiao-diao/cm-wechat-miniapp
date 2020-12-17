//registerOne.js
import { http } from "./../../utils/util";
import "./../../utils/fix";
import _ from "./../../utils/lodash"

//获取应用实例
const app = getApp()

Page({
  data: {
    limit: 10,
    page: 0,
    list: [],
    studentId:""
  },
  onLoad: function (option) {
    let studentId = option.studentId;
    this.setData({studentId});
    this.getMyFansList(studentId);
  },
  //加载我的粉丝列表
  //params {boolean} isMore  是否加载更多
  getMyFansList: function (studentId) {
    let cmd = "/auth/relation/myFansList";
    let { limit, page } = this.data;
    let data = { limit, page, studentId };
    http.get({
      cmd,
      data,
      success: res => {
        if (_.get(res, 'data.code') == 200) {
          let list = _.get(res, 'data.data.list');
          this.setData({ list, page: page + 1 });
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
    const { studentId } = this.data;
    this.getMyFansList(studentId)
  }
}) 