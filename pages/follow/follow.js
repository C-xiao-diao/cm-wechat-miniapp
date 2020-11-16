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
    content: '',
    picture: [],
    video: [],
  },
  onLoad(option) {
    this.setData({ themeId: option.themeId })
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
    //获取图片
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log("111111111111111111111111111111", res)
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        //上传至服务器
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
            const data = res.data
            if(_.get(res, 'data.code') ===200){
              let fileName = _.get(res, 'data.data.fileName');
              let file = fileName[0];
              let picture = this.data.picture;
              let pics = _.uniq(_.concat(picture, fileName));
              console.log(pics, 'mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm')
              this.setData({picture: pics});
            } else {

            }
            //do something
            console.log(res, 4444444444444444444444444444444444);
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
    if(_.isEmpty(picture)){
      wx.showToast({
        title: '图片不能为空',
      })
      return;
    }
    let cmd = "/auth/essay/addEssay";
    let data = {
      studentId,
      themeId,
      content,
      picture
    }
    console.log(data, 'vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv')
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
        console.log(res, 999999999999999999999999999999);
      }
    })
  }
})