//hotlist.js
import "./../../utils/fix";
import _ from "./../../utils/lodash"
import { http } from "./../../utils/util";
import { multiArray, objectMultiArray } from './../../utils/pickerLinkCity'


//获取应用实例
const app = getApp()
let pageX = 0;
let moveX = 0;
let list = [];

Page({
  data: {
    // 省市选择器数据
    multiIndex: [0, 0],
    multiArray: multiArray,
    objectMultiArray: objectMultiArray,
    testList: [1,2,3],
    //骨架
    loading: true,
    //0未注册，1已注册  2 未登录  （其中 0 1 状态后端返回，2状态是用户拒绝授权）
    reviewStatus: app.globalData.reviewStatus || 0,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    currentTab: 0,
    // listHot: ['哆', '来', '咪', '发', '唆', '拉', '西'],
    list: [],
    // 是否显示用户信息授权按钮
    isShowUserInfoBtn: true,
    //是否现实切换学校的弹框
    isShowSchoolChangeModal: false,
    //起个调的主题
    theme: "",
    address: "全国",
    schoolName: "",
    schoolId: '',
    //学校列表
    schoolList: [],
    isShowSchoolListModal: false,
    //即兴的最新一条主题
    currentListItem: {},
    isShowListItem: true,
    //滑动的x坐标
    pageX: 0,
    //滑块的x坐标
    x: 20,
  },
  onLoad: function () {
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse) {
    //   console.log('接到了app的回调1111111111111111111111111111111', app)
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     console.log(res,'接到了app的回调222222222222222222222222222222')
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }

    //app.js登录后需要执行的 callback 写在此处
    // app.loginCallback = resData => {
    //   console.log("执行了loginCallback回调",)
    //   if (_.get(resData, 'code') === 200) {
    //     this.setData({ reviewStatus: resData.data.reviewStatus, userInfo: app.globalData.userInfo })
    //     this.getIndexList(this.data.currentTab, false);
    //   } else {
    //     //没有拿到wx.login的回调
    //   }
    // }
  },
  onShow: function () {
    console.log("执行了首页的onShow操作", app.globalData)
    //注意，主页 onLoad可能提前于 小程序 onLaunch 执行完， 
    // 用户id 在onLaunch 的login里获取，所以 首页加载数据，要么 写在 onShow里，要么写在onLoad的 callback回调里
    let _this = this;
    wx.getSetting({
      withSubscriptions: true,
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          _this.setData({ isShowUserInfoBtn: false });
        }
      }
    })

    if (!app.globalData.userId) {
      app.loginCallback = resData => {
        console.log("执行了loginCallback回调--------------------------",)
        if (_.get(resData, 'code') === 200) {
          this.setData({ reviewStatus: resData.data.reviewStatus, userInfo: app.globalData.userInfo })
          this.getIndexList(this.data.currentTab, false);
        } else {
          //没有拿到wx.login的回调
        }
      }
    } else {
      this.setData({ reviewStatus: app.globalData.reviewStatus, userInfo: app.globalData.userInfo })
      this.getIndexList(this.data.currentTab, false);
    }

    //每次进入界面，都需要刷新列表数据
    // if(app.globalData.userId){
    //   this.getIndexList(this.data.currentTab, false);
    // }
  },

  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  //登录接口
  userInfoHandler: function (e) {
    console.log(e,'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk')
    if (!_.isEmpty(e.detail.userInfo)) {
      e.detail.userInfo.sex = e.detail.userInfo.gender;
      e.detail.userInfo.headimgUrl = e.detail.userInfo.avatarUrl;
      app.globalData.userInfo = _.assign(e.detail.userInfo,app.globalData.userInfo);
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true,
        isShowUserInfoBtn: false,
        reviewStatus: 0
      })
      if (app.globalData.userId) {
        this.updateUserInfoTosServer(e.detail.userInfo, e.detail.iv, e.detail.encryptedData)
      } else {
        //根据微信文档，app.js里的 wx.login 的返回不一定在首页 index.js 生命周期前返回，这里做一个容错，如果拿不到、//userId，则再去登录一遍
        this._login(e.detail.userInfo, e.detail.iv, e.detail.encryptedData);
      }
    } else {
      this.setData({reviewStatus: 2})
    }
  },
  //登录

  _login: function (userInfo, iv, encryptedData) {
    var that = this;
    wx.login({
      success(res) {
        if (res.code) {
          let cmd = "/api/cWeChat/appletsGetOpenid";
          http.get({
            cmd,
            data: { code: res.code },
            success: res => {
              if (_.get(res, 'data.code') === 200 && !_.isEmpty(_.get(res, 'data.data'))) {
                var resData = res.data;
                app.globalData.userId = resData.data.weChatUserId;
                app.globalData.openId = resData.data.openid;
                app.globalData.unionid = resData.data.unionid;
                app.globalData.studentId = resData.data.studentId;
                app.globalData.isVip = resData.data.isVip;
                app.globalData.studentName = resData.data.studentName;
                app.globalData.reviewStatus = resData.data.reviewStatus;
                app.globalData.step = resData.data.step;
                let userInfo ={};
                if(resData.data.nickName){
                  userInfo.nickName = resData.data.nickName;
                }
                if(resData.data.sex){
                  userInfo.sex = resData.data.sex;
                }
                if(resData.data.city){
                  userInfo.city = resData.data.city;
                }
                if(resData.data.schoolName){
                  userInfo.schoolName = resData.data.schoolName;
                }
                if(resData.data.schoolId){
                  userInfo.schoolId = resData.data.schoolId;
                }
                if(resData.data.noteNumber){
                  userInfo.noteNumber = resData.data.noteNumber;
                }
                if(resData.data.headimgUrl){
                  userInfo.headimgUrl = resData.data.headimgUrl;
                }
                app.globalData.userInfo = userInfo;
                that.updateUserInfoTosServer(userInfo, iv, encryptedData)
              }
            }
          })
        } else {
          // console.log('登录失败'+res.errMsg);
          wx.showToast({ title: '登录失败!' });
        }
      }
    })
  },

  //修改用户信息
  updateUserInfoTosServer: function (userInfo, iv, encryptedData) {
    let cmd = "/auth/cWechat/editUser";
    let data = {
      openid: app.globalData.openId,
      unionid: app.globalData.unionid,
      studentId: app.globalData.studentId,
      nickname: userInfo.nickName,
      sex: userInfo.gender,
      province: userInfo.province,
      city: userInfo.city,
      country: userInfo.country,
      headimgurl: userInfo.avatarUrl,
      userId: app.globalData.userId,
      iv,
      encryptedData
    };
    http.post({
      cmd,
      data,
      success: res => {
        var resData = res.data;
        if (resData.code == 200 || resData.code == 103) {
          wx.showToast({
            title: '授权成功',
          })
        }
      }
    })
  },


  onShareAppMessage: function (e) {

  },
  //-----------------start------------------
  //省市选择器方法（切换城市）
  bindCityChange: function (e) {
    console.log(e,'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
    //获取学校列表
    this.getSchoolList(null, list[e.detail.value[1]]);
    this.setData({
      "multiIndex[0]": e.detail.value[0],
      "multiIndex[1]": e.detail.value[1],
      address: list[e.detail.value[1]],
      isShowSchoolListModal: true
    })
  },
  //省市选择器方法（切换城市）
  bindMultiPickerColumnChange: function (e) {
    switch (e.detail.column) {
      case 0:
        list = []
        for (var i = 0; i < this.data.objectMultiArray.length; i++) {
          if (this.data.objectMultiArray[i].parid == this.data.objectMultiArray[e.detail.value].regid) {
            list.push(this.data.objectMultiArray[i].regname)
          }
        }
        this.setData({
          "multiArray[1]": list,
          "multiIndex[0]": e.detail.value,
          "multiIndex[1]": 0
        })
      break; 
    };
  },
  //切换学校弹框显示
  changeSchool: function () {
    this.setData({ isShowSchoolChangeModal: true, schoolName: "", schoolId: ""  })
  },
  //选择地址底部框显示
  // bindPickerChange: function (e) {
  //   const value = e.detail.value;
  //   this.setData({ address: value[2], isShowSchoolListModal: true });
  //   this.getSchoolList(null, value[2]);
  // },
  //获取学校列表
  getSchoolList: function (schoolAlias, city) {
    console.log(city,'[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[');
    let cmd = "/auth/school/listBy";
    let data = {};
    if (schoolAlias !== undefined && schoolAlias !== null) {
      data.schoolAlias = schoolAlias;
    }
    if (city !== undefined && city !== null) {
      data.city = city;
    }
    http.get({
      cmd,
      data,
      success: res => {
        if (_.get(res, 'data.code') === 200) {
          this.setData({ schoolList: _.get(res, 'data.data.list') })
        }
        console.log(res, 1111111111112222222222222222222222222222222222);
      }
    })
  },
  //选择学校
  selectSchool: function (e) {
    const id = e.currentTarget.dataset.id;
    const name = e.currentTarget.dataset.name;
    this.setData({ schoolName: name, schoolId: id, isShowSchoolListModal: false });
  },
  comfirmSchool: function (e) {
    let { schoolName, schoolId } = this.data;
    if(!schoolName){
      schoolName = "";
      schoolId = "";
    }
    this.setData({ isShowSchoolChangeModal: false, schoolName, schoolId },() =>{
      this.getIndexList(this.data.currentTab, false);
    });
  },
  cancelSchool: function () {
    this.setData({ isShowSchoolListModal: false, isShowSchoolChangeModal: false });
  },
  //前往注册界面
  navToRegister: function () {
    let step = app.globalData.step;
    if(step === 0){
      //注册已完成，实际上不会看到注册按钮
    } else if(step === 1){
      wx.navigateTo({ url: '/pages/registerOne/registerOne'})
    } else if(step === 2){
      wx.navigateTo({ url: '/pages/registerTwo/registerTwo'})
    } else {
      wx.navigateTo({ url: '/pages/registerOne/registerOne'})
    }
  },
  //前往个人中心界面
  navToMemberCenter: function () {
    wx.navigateTo({
      url: '/pages/memberCenter/memberCenter'
    })
  },
  // 获取首页列表数据
  getIndexList: function (tab, isRandom) {
    const { userInfo } = this.data;
    let address = this.data.address;
    let schoolId = this.data.schoolId;
    wx.showLoading({ title: '正在加载' })
    const timestamp = Date.parse(new Date());
    let currentTab = tab;
    let cmd = "";
    let data = { timestamp };
    if (schoolId) {
      data.schoolId = schoolId;
    }
    if(address && !schoolId){
      data.city = address != "全国" ? address: '';
    }
    if (currentTab === 0) {
      cmd = "/auth/theme/listHot";
    } else if (currentTab === 1) {
      cmd = "/auth/student/characterList";
    } else {
      cmd = "/auth/theme/listRandom";
    }
    if (isRandom) {
      let listRandom = this.data.list;
      let ids = [];
      for (let i = 0; i < listRandom.length; i++) {
        ids.push(listRandom[i].id);
      }
      data = { ids, timestamp };
    }
    http.get({
      cmd,
      data,
      success: res => {
        if (_.get(res, 'data.code') === 200) {
          let list = _.get(res, 'data.data.list');
          list = _.map(list, o=> {
            if(o.pointPraiseNumber){
              o.pointPraiseNumber = _.round(o.pointPraiseNumber);
            }
            if(o.noteNumber){
              o.noteNumber = _.round(o.noteNumber);
            }
            return o;
          })
          this.setData({ list, currentTab, loading: false,isShowListItem: true })
        } else {
          wx.showToast({
            title: '请求异常',
          })
        }
      }
    })
  },
  //切换tab页（嗨C、即兴）
  changeTab: function (e) {
    let reviewStatus = _.get(app, 'globalData.reviewStatus');
    if(reviewStatus !== 1){
      this.navToRegister();
      return;
    }
    const { currentTab } = this.data;
    let item = e.currentTarget.dataset.item;
    if (item !== currentTab) {
      this.getIndexList(item, false)
    }
  },
  //随机刷新 即兴列表
  freestyleHandle: function () {
    this.getIndexList(1, true);
  },
  //跟调
  navToFollow: function (e) {
    let themeId = e.currentTarget.dataset.themeid;
    let theme = e.currentTarget.dataset.theme;
    wx.navigateTo({
      url: '/pages/follow/follow?themeId=' + themeId + '&theme=' + theme,
    })
  },
  // 跳转详情
  navToDetail: function (e) {
    let reviewStatus = _.get(app, 'globalData.reviewStatus');
    if(reviewStatus !== 1){
      this.navToRegister();
      return;
    }
    let index = e.currentTarget.dataset.index;
    let themeId = e.currentTarget.dataset.themeid;
    let theme = e.currentTarget.dataset.theme;
    let content = e.currentTarget.dataset.content;
    let number = e.currentTarget.dataset.number;
    let picture = e.currentTarget.dataset.picture;
    console.log(theme, content, number, picture, 'cccccccccccccccccccccccccc');
    //播放音频
    const innerAudioContext = wx.createInnerAudioContext();
    // innerAudioContext.autoplay = true;
    switch (index) {
      case 0:
        innerAudioContext.src = '/audios/duo.m4a';
        break;
      case 1:
        innerAudioContext.src = '/audios/rai.m4a';
        break;
      case 2:
        innerAudioContext.src = '/audios/mi.m4a';
        break;
      case 3:
        innerAudioContext.src = '/audios/fa.m4a';
        break;
      case 4:
        innerAudioContext.src = '/audios/suo.m4a';
        break;
      case 5:
        innerAudioContext.src = '/audios/la.m4a';
        break;
      case 6:
        innerAudioContext.src = '/audios/xi.m4a';
        break;
    }
    innerAudioContext.play();
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    //跳转界面
    app.globalData.currentThemeId = themeId;
    wx.navigateTo({
      url: '/pages/forumList/forumList?themeId=' + themeId
        + '&theme=' + theme
        + '&content=' + content
        + '&number=' + number
        + '&picture=' + JSON.stringify(picture),
    })
  },
  // 阻止页面事件传递至父元素
  stopCancelModal: function () {

  },
  // 隐藏模态输入框
  cancelModal: function () {
    this.setData({ isShowSchoolChangeModal: false })
  },
  //跳转至起个调界面
  navToStartTune: function () {
    let reviewStatus = _.get(app, 'globalData.reviewStatus');
    if(reviewStatus !== 1){
       this.navToRegister();
    }
    //跳转至新页面
    wx.navigateTo({
      url: '/pages/startTune/startTune',
    })
  },
  //滑动即兴卡片
  cardMoveHandle: function(e){
    // let x = e.detail.x;
    // if(moveX >= x){
    //   this.setData({isShowListItem: false})
    //   return;
    // } else {

    // }
    // moveX = x;
  },
  bindtouchstart: function(e){
    pageX = e.changedTouches[0].pageX;
  },
  bindtouchend: function(e){
    let endPageX = e.changedTouches[0].pageX;
    if(endPageX - pageX > 100){
      this.setData({isShowListItem: false},()=>{
        this.getIndexList(this.data.currentTab, true)
      })
    } else {
      this.setData({x: 20})
    }
  },
  // 不感兴趣
  noInterested: function(){
    this.getIndexList(this.data.currentTab, true)
  }
  //-----------------end -------------------
})  