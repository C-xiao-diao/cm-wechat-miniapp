//follow.js
import { http } from "./../../utils/util";
import config from "./../../configs/config"
import "./../../utils/fix";
import _ from "./../../utils/lodash"
//获取应用实例
const app = getApp()

Page({
  data: {
    themeId: '',
    theme:"",
    content: '',
    picture: [],
    video: [],
  },
  onLoad(option) {
    this.setData({ themeId: option.themeId,theme: option.theme })
  },
  goBack: function () {
    wx.navigateBack();
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
        wx.showLoading({ title: '正在上传...'});
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
            let resData = JSON.parse(json)
            if(_.get(resData, 'code') ===200){
              let fileName = _.get(resData, 'data.fileName');
              let file = fileName[0];
              let picture = _this.data.picture;
              let pics = _.uniq(_.concat(picture, fileName));
              _this.setData({picture: pics});
            } else {

            }
          },
          complete: function(){
            wx.hideLoading();
          }
        })
      }
    })
  },
  // 跟调（也就是提交）
  follow: function () {
    const { themeId, content, picture } = this.data;
    let studentId = app.globalData.studentId;
    if(_.isEmpty(content)){
      wx.showToast({
        title: '跟调内容不能为空',
      })
      return;
    }
    wx.showLoading({
      title: '提交中',
    })
    // if(_.isEmpty(picture)){
    //   wx.showToast({
    //     title: '图片不能为空',
    //   })
    //   return;
    // }
    let cmd = "/auth/essay/addEssay";
    let data = {
      studentId,
      themeId,
      content,
      picture
    }
    http.post({
      cmd,
      data,
      success: res => {
        if(_.get(res, 'data.code')=== 200){
          wx.showToast({
            title: '跟调成功',
            success: res =>{
              wx.navigateBack({
                delta: 0,
              })
          
            },         
          })
        }
      }
    })
  }
})