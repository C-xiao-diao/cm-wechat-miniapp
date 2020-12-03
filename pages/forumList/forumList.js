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
    themeInfo:{},
    content: '',
    number: 0,
    picture: [],
    floorstatus: false,
    //是否显示顶部主题图片组
    isShowTopThemeImages: false,
    essayId: '',
    list: [],
    // 每页数据
    limit: 10,
    // 页码
    page: 0,
    isShowEnsembleModal: false,
    isShowEnsemblePicker: false,
    ensembleType: 0,               //合拍类型，0是合拍主题  1是合拍跟帖
    pickerList: [1000, 500, 200, 100, 50, 10, 5, 1],
    //音符数量
    musicNumber: 0
  },
  onLoad: function (option) {
    this.setData({ themeId: option.themeId, theme: option.theme, content: option.content, number: option.number, picture: JSON.parse(option.picture) })
    //获取界面数据
    // this.getForumList(option)
  },
  onShow: function () {
    //获取界面数据
    const { themeId } = this.data;
    let option = { themeId };
    this.getForumList(option, false)
  },
  // ---------------------- start ------------------------------
  //展开图片列表
  showAllDetail: function(){
    let isShow = this.data.isShowTopThemeImages;
    this.setData({isShowTopThemeImages: !isShow});
  },
  //获取数据列表
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
          let themeInfo = _.get(res, 'data.data.theme');
          if(themeInfo){
            themeInfo.pointPraiseNumber = _.round(themeInfo.pointPraiseNumber);
          }
          let newList = [];
          if (isLoadMore) {
            newList = _.uniqBy(_.concat(list, _.get(res, 'data.data.list')), 'id');
          } else {
            newList = _.get(res, 'data.data.list');
          }
          newList = _.map(newList, o=> {
            if(o.pointPraiseNumber){
              o.pointPraiseNumber = _.round(o.pointPraiseNumber);
            }
            if(o.noteNumber){
              o.noteNumber = _.round(o.noteNumber);
            }
            return o;
          })
          this.setData({ list: newList, page: newPage,themeInfo });
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
    this.setData({ isShowEnsembleModal: true, essayId,ensembleType: 1,musicNumber: 1 })
  },
  //点击音符数量
  selectEnsembleNum: function (e) {
    let musicNumber = e.currentTarget.dataset.value;
    this.setData({ musicNumber, isShowEnsemblePicker: false })
  },
  //点击合拍按钮提交
  ensembleHandle: function () {  // 0是合拍主题   1是合拍跟帖
    let studentId = app.globalData.studentId;
    let { musicNumber, list, essayId, ensembleType, themeId } = this.data;
    let cmd = "/auth/essay/pointPraise";
    //ps 此接口 themeId, essayId 只用传一个
    let data = {};
    if(ensembleType ===1){
      data = { studentId, essayId, number: musicNumber };
    } else {
      data = { studentId, themeId, number:musicNumber };
    }
    http.get({
      cmd,
      data,
      success: res => {
        if (_.get(res, 'data.code') === 200) {
          wx.showToast({ title: '合拍成功',})
          let noteNumber = _.get(res, 'data.data.noteNumber');
          let studentNoteNumber = _.get(res, 'data.data.studentNoteNumber');
          // todo 更新首页用户的音符数量，依赖后端计算返回，涉及到钱一律服务端计算
          app.globalData.userInfo.noteNumber = studentNoteNumber;
          if(ensembleType ===1){
            let idx = _.findIndex(list, o=>o.id === essayId);
            list[idx].pointPraiseNumber = noteNumber;
            this.setData({ isShowEnsembleModal: false,list })
          } else {
            let themeInfo = {};
            themeInfo.pointPraiseNumber = _.round(noteNumber)
            this.setData({ isShowEnsembleModal: false,themeInfo})
          }        
        } else {
          wx.showToast({ title: _.get(res, 'data.msg')})
        }
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
  //前往邀请界面(需求修改为合拍，而非跳转)
  navToInvite: function () {
    const { themeId } = this.data;
    // wx.navigateTo({
    //   url: '/pages/invite/invite?themeId=' + themeId,
    // })
    this.setData({ isShowEnsembleModal: true, ensembleType: 0 });
  },
  //前往个人中心界面
  navToMemberCenter: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/memberCenter/memberCenter?studentId=' + id
    })
  },
  //前往跟调界面
  navToFollow: function () {
    const { themeId, theme } = this.data;
    wx.navigateTo({
      url: '/pages/follow/follow?themeId=' + themeId + '&theme=' + theme,
    })
  },
  //预览图片
  previewImage: function(e){
      let index = e.currentTarget.dataset.index;
      let src = e.currentTarget.dataset.src;
      if(typeof src == 'string'){
          wx.previewImage({
              current: src, 
              urls: [src], 
              success: function(){}
          })
      }else{
        console.log(111111)
          wx.previewImage({
              current: src[index], 
              urls: src,
              success: function(){}
          })
      }
  },
  //获取滚动条当前位置
  onPageScroll: function (e) {
      if (e.scrollTop > 100) {
          this.setData({ floorstatus: true });
      } else {
          this.setData({ floorstatus: false });
      }
  },
  //回到顶部
  goTop: function (e) {  // 一键回到顶部
      if (wx.pageScrollTo) {
          wx.pageScrollTo({ scrollTop: 0 })
      } else {
          wx.showModal({
              title: '提示',
              content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
          })
      }
  }
  // ----------------------  end --------------------------------
})
