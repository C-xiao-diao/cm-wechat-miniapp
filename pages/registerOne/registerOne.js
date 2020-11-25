//registerOne.js
import { http } from "./../../utils/util";
import config from "./../../configs/config"
import "./../../utils/fix";
import _ from "./../../utils/lodash"

//获取应用实例
const app = getApp()

Page({
  data: {
    headimgUrl: "",
    nickname: ""
  },
  onLoad: function () {
  },
  //昵称输入框方法
  bindinput: function (e) {
    const value = e.detail.value;
    if (value) {
      this.setData({ nickname: value });
    }
  },
  // 选取图片
  _chooseImage: function () {
    const _this = this;
    //获取图片
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        //上传至服务器
        wx.showLoading({ title: '正在上传...' });
        wx.uploadFile({
          url: config.uploadUrl,
          filePath: tempFilePaths[0],
          header: {
            'content-type': 'multipart/form-data'
          },
          name: 'files',
          formData: {
            'theme': 'photo'
          },
          success(res) {
            console.log(res, 'fffffffffffffffffffffffffffffffffffffffffff')
            let json = res.data;
            let resData = JSON.parse(json)
            if (_.get(resData, 'code') === 200) {
              let fileName = _.get(resData, 'data.fileName');
              let file = fileName[0];
              _this.setData({ headimgUrl: file });
            } else {

            }
          },
          complete: function () {
            wx.hideLoading();
          }
        })
      }
    })
  },
  navToNextStep: function () {
    // const { headimgUrl, nickname } = this.data;
    // let cmd = "/auth/student/editStudent";
    // let studentId = app.globalData.studentId;
    // let data = {
    //   studentId,
    //   headimgUrl,
    //   nickname,
    // }
    // http.get({
    //   cmd,
    //   data,
    //   success: res => {
    //     if (_.get(res, 'data.code') === 200) {
    //       wx.showToast({
    //         title: '操作成功',
    //       })
    //       wx.navigateTo({
    //         url: '/pages/registerTwo/registerTwo',
    //       })
    //     }
    //   }
    // })

    // 测试用
    wx.navigateTo({
      url: '/pages/registerTwo/registerTwo',
    })
  }
})