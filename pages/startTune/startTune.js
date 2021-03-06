//startTune.js
import { http } from "./../../utils/util";
import config from "./../../configs/config"
import "./../../utils/fix";
import _ from "./../../utils/lodash"
//获取应用实例
const app = getApp()

Page({
  data: {
    themeId: '',
    theme: "",
    content: '',
    picture: [],
    video: [],
  },
  onLoad(option) {
    console.log(this.data.picture, 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    this.setData({ themeId: option.themeId })
  },
  goBack: function () {
    wx.navigateBack();
  },
  //添加主题
  addTheme: function (e) {
    let theme = e.detail.value;
    this.setData({ theme });
  },
  // 添加内容
  addContent: function (e) {
    let content = e.detail.value;
    this.setData({ content });
  },
  // 选择图片
  addPhoto: function () {
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
            'page': 'startTune'
          },
          success(res) {
            let json = res.data;
            let resData = JSON.parse(json)
            if (_.get(resData, 'code') === 200) {
              let fileName = _.get(resData, 'data.fileName');
              let file = fileName[0];
              let picture = _this.data.picture;
              let pics = _.uniq(_.concat(picture, fileName));
              console.log(file, 'filefilefilefilefilefilefilefilefilefile');
              _this.setData({ picture: pics });
            } else {
              wx.showToast({ title: _.get(resData, 'msg') })
            }
          },
          complete: function () {
            wx.hideLoading();
          }
        })
      }
    })
  },
  // 起个调（也就是提交）
  startTune: function () {
    const { theme, content, picture } = this.data;
    console.log(picture, 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')
    let studentId = app.globalData.studentId;
    if (_.isEmpty(theme)) {
      wx.showToast({
        title: '起调标题不能为空',
      })
      return;
    }
    if (_.isEmpty(content)) {
      wx.showToast({
        title: '起调内容不能为空',
      })
      return;
    }
    if (_.isEmpty(picture)) {
      wx.showToast({
        title: '图片不能为空',
      })
      return;
    }
    let cmd = "/auth/theme/addTheme";
    let data = {
      publisher: studentId,
      theme,
      supplementaryContent: content,
      picture
    }
    http.post({
      cmd,
      data,
      success: res => {
        if (_.get(res, 'data.code') === 200) {
          wx.showToast({
            title: '起调成功',
            success: res => {
              wx.navigateBack({
                delta: 0,
              })
            },
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