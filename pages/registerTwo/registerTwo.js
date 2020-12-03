//registerTwo.js
import { http } from "./../../utils/util";
import "./../../utils/fix";
import _ from "./../../utils/lodash"

Page({
  data: {
    address: '长沙市',
    idCardNumber: '',
    name: '',
    schoolId: '',
    schoolName: '',
    schoolList: [],
    isShowSchoolListModal: false
  },
  onLoad: function () {
    //查询学校列表
    this.getSchoolList();
    let cmd = "/auth/school/listBy";
  },
  //获取学校列表
  getSchoolList: function (schoolAlias) {
    let cmd = "/auth/school/listBy";
    let data = {};
    if (schoolAlias !== undefined && schoolAlias !== null) {
      data.schoolAlias = schoolAlias;
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
  bindPickerChange: function (e) {
    const value = e.detail.value;
    this.setData({ address: value[2] });
  },
  bindSchoolHandle: function (e) {
    let schoolAlias = e.detail.value;
    this.getSchoolList(schoolAlias);
  },
  showAllSchoolList: function () {
    this.setData({ isShowSchoolListModal: true })
  },
  hideAllSchoolList: function () {
    this.setData({ isShowSchoolListModal: false })
  },
  //选择学校
  selectSchool: function (e) {
    const id = e.currentTarget.dataset.id;
    const name = e.currentTarget.dataset.name;
    this.setData({ schoolName: name, schoolId: id ,isShowSchoolListModal: false});
    console.log(e, 'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
  },
  bindIdCardHandle: function (e) {
    let idCardNumber = e.detail.value;
    this.setData({ idCardNumber });
  },
  bindRealNameHandle: function (e) {
    let name = e.detail.value;
    this.setData({ name });
  },
  //下一步
  registerTwoSubmit: function () {
    const _this = this;
    const { schoolId, schoolName, idCardNumber, name, address } = this.data;
    if(!schoolName){
      wx.showToast({
        title: '请选择学校',
      })
      return;
    }
    if(!idCardNumber){
      wx.showToast({
        title: '请输入身份证号',
      })
      return;
    }
    if(!name){
      wx.showToast({
        title: '请输入真实姓名',
      })
      return;
    }
    //提前发起授权
    wx.authorize({
      scope: 'scope.camera',
      success(res) {
        //跳转界面
        wx.navigateTo({
          url: '/pages/auditing/auditing?schoolId=' + schoolId 
          + "&schoolName=" + schoolName 
          + "&idCardNumber=" + idCardNumber
          + "&name=" + name
        })
      },
      fail(res) {
        _this.openSetting();
      }
    })
  },
  // 前往设置界面
  openSetting: function () {
    const _this = this;
    wx.getSetting({
      success(res) {
        let scope = res.authSetting;
        console.log(scope, 'scopescopescopescopescopescopescope');
        if (!scope['scope.camera']) {
          wx.showModal({
            title: '警告',
            content: '若不授权使用摄像头，将无法使用人脸识别功能！',
            cancelText: '不授权',
            cancelColor: '#1ba9ba',
            confirmText: '授权',
            confirmColor: '#1ba9ba',
            success: (res) => {
              if (res.confirm) {//允许打开授权页面
                //调起客户端小程序设置界面，返回用户设置的操作结果
                wx.openSetting({
                  success: (res) => {
                    res.authSetting = {
                      "scope.camera": true
                    }
                  },
                })
              } else if (res.cancel) {//拒绝打开授权页面
                // wx.navigateBack({ delta: 1 })
              }
            }
          })
        }
      }
    })
  }
})