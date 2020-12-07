//registerTwo.js
import { http } from "./../../utils/util";
import "./../../utils/fix";
import _ from "./../../utils/lodash"
import { multiArray, objectMultiArray } from './../../utils/pickerLinkCity'

let list = [];

Page({
  data: {
    // 省市选择器数据
    multiIndex: [0, 0],
    multiArray: multiArray,
    objectMultiArray: objectMultiArray,
    address: '全国',
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
  bindCityChange: function (e) {
    //获取学校列表
    // this.getSchoolList(null, list[e.detail.value[1]]);
    this.setData({
      "multiIndex[0]": e.detail.value[0],
      "multiIndex[1]": e.detail.value[1],
      address: list[e.detail.value[1]],
      // isShowSchoolListModal: true
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
  //获取学校列表
  getSchoolList: function (schoolAlias) {
    let address = this.data.address;
    let cmd = "/auth/school/listBy";
    let data = { city: address };
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
    this.getSchoolList();
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
    if(!idCardNumber || idCardNumber.length != 18){
      wx.showToast({
        title: '请输入正确的身份证号',
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