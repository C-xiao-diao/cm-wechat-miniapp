//registerOne.js
import { http,isJson } from "./../../utils/util";
import config from "./../../configs/config"
import "./../../utils/fix";
import _ from "./../../utils/lodash"

//获取应用实例
const app = getApp()

Page({
  data: {
    headimgUrl: "",
    nickname: "",
  },
  onLoad: function () {
    this.setData({
      headimgUrl: _.get(app, 'globalData.userInfo.headimgUrl'),
      nickname: _.get(app, 'globalData.userInfo.nickName')
    })
    console.log(app, 'appppppppppppppppppppppppppppppppp')
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
            let json = res.data;
            let resData;
            if(isJson(json)){
              resData = JSON.parse(json)
            } else {
              resData = json;
            }
            if (_.get(resData, 'code') === 200) {
              let fileName = _.get(resData, 'data.fileName');
              let file = fileName[0];
              _this.setData({ headimgUrl: file });
            } else {
              wx.showToast({
                title: _.get(resData, 'msg'),
              })
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
    const { headimgUrl, nickname } = this.data;
    if (!headimgUrl) {
      wx.showToast({
        title: '请选择头像',
      })
      return;
    }
    if (!nickname) {
      wx.showToast({
        title: '请输入昵称',
      })
      return;
    }
    let cmd = "/auth/student/editStudent";
    let studentId = app.globalData.studentId;
    let data = {
      studentId,
      headimgUrl,
      nickname,
    }
    http.get({
      cmd,
      data,
      success: res => {
        if (_.get(res, 'data.code') === 200) {
          let userInfo = {};
          userInfo.nickName = nickname;
          userInfo.headimgUrl = headimgUrl;
          app.globalData.userInfo = _.assign(app.globalData.userInfo,userInfo);
          wx.showToast({
            title: '操作成功',
          })
          wx.navigateTo({
            url: '/pages/registerTwo/registerTwo',
          })
        } else {
          wx.showModal({
            title: '提示',
            content: _.get(res, 'data.msg') || '操作失败',
            success(res) {
              if (res.confirm) {

              } else if (res.cancel) {

              }
            }
          })
        }
      }
    })
  }
})