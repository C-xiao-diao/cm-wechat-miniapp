//forumList.js
import { http } from "./../../utils/util";
import "./../../utils/fix";
import _ from "./../../utils/lodash"

//获取应用实例
const app = getApp()

Page({
  data: {
    loading: true,
    //---------start ----------
    // 主题id
    themeId:"",
    list: [],
    // 每页数据
    limit: 10,
    // 页码
    page: 0
  },
  onLoad: function (option) {
    this.setData({ themeId: option.themeId })
    //获取界面数据
    // this.getForumList(option)
  },
  onShow: function(){
    //获取界面数据
    const { themeId  } = this.data;
    let option  = { themeId };
    console.log(themeId,'gggggggggggggggggggggggggggggggsssssssssssssssssssss');
    this.getForumList(option, false)
  },
  // ---------------------- start ------------------------------
  getForumList: function(option, isLoadMore){
    const timestamp = Date.parse(new Date());
    let { limit, list, page} = this.data;
    let newPage = isLoadMore ? page + 1 : 0;
    let cmd = "/auth/essay/list";
    let data = {
      themeId: option.themeId,
      studentId: app.globalData.studentId,
      page: newPage,
      limit,
      timestamp,
    }
    http.get({
      cmd,
      data,
      success: res =>{
        if(_.get(res, 'data.code') ===200){
          let newList = [];
          if(isLoadMore){
            newList = _.uniqBy(_.concat(list, _.get(res, 'data.data.list')), 'id');
          } else {
            newList = _.get(res, 'data.data.list');
          }
          
          this.setData({list: newList, page: newPage});
        }
      }
    })
  },
  onShareAppMessage: function (e) {

  },
  onReachBottom:function(e){
    const { themeId , page } = this.data;
    let option  = { themeId };
    this.getForumList(option, true);
  },
  // 点赞
  like: function(e){
    console.log(e,'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
    let essayId = e.currentTarget.dataset.id;
    let cmd = "/auth/essay/pointPraise";
    let data ={
      studentId: app.globalData.studentId,
      themeId: this.data.themeId,
      essayId,
    }
    http.get({
      cmd,
      data,
      success: res=>{
        if(_.get(res,'data.code') === 200){
          wx.showToast({ title: '点赞成功' });
          let list = this.data.list;
          let newList = [];
          for (let i=0;i<list.length;i++){
            let item = {};
            item = list[i];
            if(list[i].id == essayId){
              item.pointPraiseNumber = list[i].pointPraiseNumber  + 1; 
            }
            newList.push(list[i]);
          }
          this.setData({list: newList});
        } else {

        }
      }
    })
  },
  //跟调
  navToFollow: function(){
    const { themeId } = this.data;
    wx.navigateTo({
      url: '/pages/follow/follow?themeId=' + themeId,
    })
  }
  // ----------------------  end --------------------------------
})
