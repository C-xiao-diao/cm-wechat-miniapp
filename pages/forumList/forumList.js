//forumList.js
import { http } from "./../../utils/util";
import "./../../utils/fix";
import _ from "./../../utils/lodash"
import moment from "./../../utils/moment"

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
    musicNumber: 0,
    studentInformation: null,
    followStateClass: "",
    followStateTxt: "",
    isSelf: false
  },
  onLoad: function (option) {
    console.log(option, 'optionoptionoptionoptionoptionoptionoptionoptionoptionoption');
    this.setData({ themeId: option.themeId, theme: option.theme, content: option.content, number: option.number, picture: (option.picture && option.picture != "undefined") ? JSON.parse(option.picture) : [] })
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
          let studentInformation = null;
          let followState = _.get(res, 'data.data.followStatus');
          if(followState == 1){ followState = 0 }
          let mutualPowderState = _.get(res, 'data.data.mutualPowderState');
          if(mutualPowderState == 1){ mutualPowderState = 0 }

          let followStateTxt = "", followStateClass = "";
          if(followState == -1 && mutualPowderState == -1){
              followStateTxt = "关注";
              followStateClass = "guanzhu";
          }else if(followState == 0 && mutualPowderState == -1){
              followStateTxt = "已关注";
              followStateClass = "yiguanzhu";
          }else if(followState == 0 && mutualPowderState == 0){
              followStateTxt = "互相关注";
              followStateClass = "huxiangguanzhu";
          }else if(followState == -1 && mutualPowderState == 0){
              followStateTxt = "回粉";
              followStateClass = "huifen";
          }
          let isSelf = false;
          if(themeInfo){
            themeInfo.pointPraiseNumber = _.round(_.toNumber(themeInfo.pointPraiseNumber)/0.85);
            studentInformation = themeInfo.studentInformation;
            if(studentInformation.id == app.globalData.studentId) {
              isSelf = true;
            }else{
              isSelf = false;
            }
          }
          let newList = [];
          if (isLoadMore) {
            newList = _.uniqBy(_.concat(list, _.get(res, 'data.data.list')), 'id');
          } else {
            newList = _.get(res, 'data.data.list');
          }
          newList = _.map(newList, o=> {
            if(o.releaseTime){
              let isToday = moment(o.releaseTime).isSame(moment(),'day');
              if(isToday){
                o.releaseTime = moment(o.releaseTime).format("HH:mm");
              }
            }
            if(o.pointPraiseNumber){
              o.pointPraiseNumber = _.round(o.pointPraiseNumber);
            }
            if(o.noteNumber){
              o.noteNumber = _.round(o.noteNumber);
            }
            return o;
          })
          this.setData({ list: newList, page: newPage,themeInfo,isSelf,studentInformation,followStateTxt, followStateClass });
        }
      }
    })
  },
  attentionOrNot: function(e){
      let type = e.currentTarget.dataset.type;
      let toStudentId = e.currentTarget.dataset.studentid;
      let fromStudentId = app.globalData.studentId;
      if(type == '关注' || type == '回粉'){
        this.attetion(toStudentId, fromStudentId, type);
      }else if(type == '已关注' || type == '互相关注'){
        this.ifCancelAttention(toStudentId, fromStudentId, type)
      }
  },
  //添加关注
  attetion: function(toStudentId, fromStudentId, type){
      let cmd = "/auth/relation/addRelation";
      let data = {toStudentId, fromStudentId};
      http.get({
        cmd,data,
        success: res =>{
          if(_.get(res, 'data.code') === 200){
              wx.showToast({title: '关注成功'})
              let followStateTxt = "", followStateClass = "";
              if(type == "关注"){
                  followStateTxt = "已关注";
                  followStateClass = "yiguanzhu";
              }else if(type == "回粉"){
                  followStateTxt = "互相关注";
                  followStateClass = "huxiangguanzhu";
              }
              this.setData({ followStateTxt, followStateClass })
          }else{
              wx.showToast({
                  title: _.get(res, 'data.msg'),
                  icon: 'none',
                  duration: 1500,
                  mask: true
              });
          }
        }
      })
  },
  //是否取消关注
  ifCancelAttention: function(toStudentId, fromStudentId, type){
      let that = this;
      wx.showModal({
        title: '提示',
        content: '是否取消关注该用户？',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if(result.confirm){
            that.cancelAttention(toStudentId, fromStudentId, type)
          }
        }
      });
  },
  //取消关注
  cancelAttention: function(toStudentId, fromStudentId, type){
      let cmd = "/auth/relation/unfollow";
      let data = {toStudentId, fromStudentId};
      http.get({
        cmd,data,
        success: res =>{
          if(_.get(res, 'data.code') === 200){
              let followStateTxt = "", followStateClass = "";
              wx.showToast({title: '取消关注成功'})
              if(type == "已关注"){
                  followStateTxt = "关注";
                  followStateClass = "guanzhu";
              }else if(type == "互相关注"){
                  followStateTxt = "回粉";
                  followStateClass = "huifen";
              } 
              this.setData({ followStateTxt, followStateClass })
          }else{
              wx.showToast({
                  title: _.get(res, 'data.msg'),
                  icon: 'none',
                  duration: 1500,
                  mask: true
              });
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
    this.setData({ isShowEnsembleModal: true, ensembleType: 0,musicNumber: 1 });
  },
  //前往个人中心界面
  navToMemberCenter: function (e) {
    let id = e.currentTarget.dataset.id;
    if(id == app.globalData.studentId){
      wx.navigateTo({
        url: '/pages/memberCenter/memberCenter?studentId=' + id + '&type=self'
      })
    }else{
      wx.navigateTo({
        url: '/pages/memberCenter/memberCenter?studentId=' + id + '&type=other'
      })
    }
  },
  //前往跟调界面
  navToFollow: function () {
    const { themeId, theme } = this.data;
    wx.navigateTo({
      url: '/pages/follow/follow?themeId=' + themeId + '&theme=' + theme + '&routeFrom=forumList',
    })
  },
  //点击学校前往首页
  navToIndex: function(e){
    let schoolId = e.currentTarget.dataset.schoolid;
    let schoolName = e.currentTarget.dataset.schoolname;
    wx.redirectTo({
      url: '/pages/index/index?schoolId=' + schoolId + '&schoolName=' + schoolName
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
