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
  },
  onLoad: function(option){
    let studentId = option.studentId;
    this.setData({studentId});
    this.getMyAttentionList(studentId);
  },
  //加载我的关注列表
  //params {boolean} isMore  是否加载更多
  getMyAttentionList: function(studentId){
    let cmd = "/auth/relation/myRelationList";
    let { limit, page } = this.data;
    let data ={ limit, page, studentId };
    http.get({
      cmd,
      data,
      success: res =>{
        if(_.get(res, 'data.code') == 200){
          let list = _.get(res, 'data.data.list');
          this.setData({ list,page: page + 1 });
        }
      }
    })
  },
  onReachBottom: function(){
    const { studentId } = this.data;
    this.getMyAttentionList(studentId);
  }
}) 