//registerOne.js
import { http,isJson } from "./../../utils/util";
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
  onLoad: function(option){
    this.getMyAttentionList();
  },
  //加载我的关注列表
  //params {boolean} isMore  是否加载更多
  getMyAttentionList: function(isMore){
    let cmd = "/auth/relation/myRelationList";
    let { limit, page } = this.data;
    let studentId = app.globalData.studentId;
    let data ={ limit, page, studentId };
    http.get({
      cmd,
      data,
      success: res =>{
        if(_.get(res, 'data.code') == 200){
          let list = _.get(res, 'data.data.list');
          this.setData({ list,page: page + 1 });
        }
        console.log(res,'==================================')
      }
    })
  },
  onReachBottom: function(){
    this.getMyFansList(true)
  }
}) 