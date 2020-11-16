//forumList.js
import { http } from "./../../utils/util";

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
    console.log(option, '[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[');
    //获取界面数据
    setTimeout(() =>{this.setData({ list: [1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 2], loading: false })}, 1000)
    this.getForumList(option)
  },
  // ---------------------- start ------------------------------
  getForumList: function(option){
    const { limit, page } = this.data;
    let cmd = "/auth/essay/list";
    let data = {
      themeId: option.themeId,
      studentId: app.globalData.studentId,
      page,
      limit,
    }
    http.get({
      cmd,
      data,
      success: res =>{
        console.log(res,'fffffffffffffffffffffffffffffffffffff');
      }
    })
  },
  onShareAppMessage: function (e) {

  },
  onReachBottom:function(e){
    console.log(11111111111111111111111111111111111);
  },
  // 点赞
  like: function(){
    
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
