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
    themeId: "",
    theme:'',
    content: '',
    number: 0,
    picture: [],
    essayId: '',
    list: [],
    // 每页数据
    limit: 10,
    // 页码
    page: 0,
    isShowEnsembleModal: false,
    isShowEnsemblePicker: false,
    pickerList: [1000, 500, 200, 100, 50, 10, 5],
    //音符数量
    number: 0
  },
  onLoad: function (option) {
    this.setData({ themeId: option.themeId, theme: option.theme, content: option.content, number: option.number, picture: option.picture })
    //获取界面数据
    // this.getForumList(option)
  },
  onShow: function () {
    //获取界面数据
    const { themeId } = this.data;
    let option = { themeId };
    console.log(themeId, 'gggggggggggggggggggggggggggggggsssssssssssssssssssss');
    this.getForumList(option, false)
  },
  // ---------------------- start ------------------------------
  getForumList: function (option, isLoadMore) {
    const timestamp = Date.parse(new Date());
    let { limit, list, page } = this.data;
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
      success: res => {
        if (_.get(res, 'data.code') === 200) {
          let newList = [];
          if (isLoadMore) {
            newList = _.uniqBy(_.concat(list, _.get(res, 'data.data.list')), 'id');
          } else {
            newList = _.get(res, 'data.data.list');
          }

          this.setData({ list: newList, page: newPage });
        }
      }
    })
  },
  onShareAppMessage: function (e) {

  },
  onReachBottom: function (e) {
    const { themeId, page } = this.data;
    let option = { themeId };
    this.getForumList(option, true);
  },
  // 点赞(现在改为合拍)
  like: function (e) {
    let essayId = e.currentTarget.dataset.id;
    this.setData({ isShowEnsembleModal: true, essayId })
    // let essayId = e.currentTarget.dataset.id;
    // let cmd = "/auth/essay/pointPraise";
    // let data ={
    //   studentId: app.globalData.studentId,
    //   themeId: this.data.themeId,
    //   essayId,
    // }
    // http.get({
    //   cmd,
    //   data,
    //   success: res=>{
    //     if(_.get(res,'data.code') === 200){
    //       wx.showToast({ title: '点赞成功' });
    //       let list = this.data.list;
    //       let newList = [];
    //       for (let i=0;i<list.length;i++){
    //         let item = {};
    //         item = list[i];
    //         if(list[i].id == essayId){
    //           item.pointPraiseNumber = list[i].pointPraiseNumber  + 1; 
    //         }
    //         newList.push(list[i]);
    //       }
    //       this.setData({list: newList});
    //     } else {

    //     }
    //   }
    // })
  },
  //点击音符数量
  selectEnsembleNum: function (e) {
    let number = e.currentTarget.dataset.value;
    this.setData({ number, isShowEnsemblePicker: false })
    console.log(e, ',,,,,,,,,,,,,,,,,,,,,,,,,,');
  },
  //点击合拍按钮提交
  ensembleHandle: function () {
    let studentId = app.globalData.studentId;
    const { number, themeId, essayId, } = this.data;
    let cmd = "/auth/essay/pointPraise";
    //ps 此接口 themeId, essayId 只用传一个
    let data = { studentId, essayId, number };
    http.get({
      cmd,
      data,
      success: res => {
        if (_.get(res, 'data.code') === 200) {
          wx.showToast({
            title: '合拍成功',
          })
          this.setData({ isShowEnsembleModal: false })
        }
        console.log(res, 'ggggggggggggggggggggggggggggggg');
      }
    })
  },
  //显示合拍弹框
  showEnsembleModal: function () {
    let isShowEnsemblePicker = this.data.isShowEnsemblePicker
    this.setData({ isShowEnsemblePicker: !isShowEnsemblePicker });
  },
  //点击遮罩层隐藏弹框
  cancelModal: function () {
    this.setData({ isShowEnsemblePicker: false, isShowEnsembleModal: false });
  },
  // 阻止页面事件传递至父元素
  stopCancelModal: function () {

  },
  //前往邀请界面
  navToInvite: function () {
    const { themeId } = this.data;
    wx.navigateTo({
      url: '/pages/invite/invite?themeId=' + themeId,
    })
  },
  //前往跟调界面
  navToFollow: function () {
    const { themeId } = this.data;
    wx.navigateTo({
      url: '/pages/follow/follow?themeId=' + themeId,
    })
  }
  // ----------------------  end --------------------------------
})
