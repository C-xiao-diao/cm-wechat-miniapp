//follow.js
import { http } from "./../../utils/util";
import config from "./../../configs/config"
import "./../../utils/fix";
import _ from "./../../utils/lodash"
//获取应用实例
const app = getApp()

let pageX = 0;
let pageY = 0;

Page({
  data: {
    themeId: '',
    theme: "",
    content: '',
    picture: [],
    // picture: ["https://cminor.cc/media/cmionr/eb62fd7d5dd144ecb70c5d8c7f07358a.jpg", "https://cminor.cc/media/cmionr/b223b397e9c049e396c8c3c8334458bf.jpg", "https://cminor.cc/media/cmionr/685336d2c17a4ef59cca1dda1bd48b26.jpg", "https://cminor.cc/media/cmionr/96b9165dd52d4477a733acc36d14fdea.jpg", "https://cminor.cc/media/cmionr/f3199e6dd81f4fb89d63ee13e16cbf1d.jpg", "https://cminor.cc/media/cmionr/a4c8c10124b7428da73903e0dbedaa94.jpg", "https://cminor.cc/media/cmionr/51455a005ea44c55835671901a2b5701.jpg", "https://cminor.cc/media/cmionr/829e569071c54f91a1286577f1f01ab1.jpg", "https://cminor.cc/media/cmionr/a6993806cb5449c98e49555abba7de84.jpg"],
    video: [],
    activeMoveViewIndex: 0,
    activeMoveX: 0,
    activeMoveY: 0,
  },
  onLoad(option) {
    this.setData({ themeId: option.themeId, theme: option.theme })
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
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        //上传至服务器
        wx.showLoading({ title: '正在上传...' });
        _this._upload(tempFilePaths);
      }
    })
  },
  // 批量上传
  _upload: function (tempFilePaths) {
    const _this = this;
    for (let i = 0; i < tempFilePaths.length; i++) {
      wx.uploadFile({
        url: config.uploadUrl,
        filePath: tempFilePaths[i],
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
          if (_.get(resData, 'code') === 200) {
            let fileName = _.get(resData, 'data.fileName');
            let picture = _this.data.picture;
            let pics = _.uniq(_.concat(picture, fileName));
            _this.setData({ picture: pics });
          } else {

          }
        },
        complete: function () {
          if(i == tempFilePaths.length -1){
            wx.hideLoading();
          }
        }
      })
    }
  },
  //删除选择的某张图片
  cancelSelectPhoto: function(e){
    let index = e.currentTarget.dataset.index;
    let picture = this.data.picture;
    picture.splice(index, 1);
    this.setData({picture});
  },
  // 拖动图片方法
  bindMovableChange: function (e) {
    
  },
  bindtouchstart: function (e) {
    pageX = e.changedTouches[0].pageX;
    pageY = e.changedTouches[0].pageY;
  },
  bindtouchend: function (e) {
    let index = e.currentTarget.dataset.index;
    //测试出，长宽 比 为 108 比 114
    //测试出，从索引 0的 图片移到索引 8 的图片的 移动 横向距离为220,  纵向距离为 224
    //所以，设计为 ：
    //横向移动超过64，则横向移动一张，横向移动超过174，则横向移动二张
    //纵向移动超过68，则纵向移动一张，纵向移动超过176，则纵向移动二张
    //上述数据通过打印得出，不一定非常精准，只是大概
    let endPageX = e.changedTouches[0].pageX;
    let endPageY = e.changedTouches[0].pageY;
    let offsetX = endPageX - pageX;
    let offsetY = endPageY - pageY;
    this.changeImage(index, offsetX, offsetY);
  },
  //执行拖拽图片操作
  changeImage: function (index, offsetX, offsetY) {
    let picture = this.data.picture;
    let hNum = 0, vNum = 0;
    //横向移动数量
    if (Math.abs(offsetX) <= 64) {
      hNum = 0;
    } else if (Math.abs(offsetX) <= 174) {
      hNum = offsetX > 0 ? 1 : -1;
    } else if (Math.abs(offsetX) > 174) {
      hNum = offsetX > 0 ? 2 : -2;
    }
    //纵向移动数量
    if (Math.abs(offsetY) <= 64) {
      vNum = 0;
    } else if (Math.abs(offsetY) <= 174) {
      vNum = offsetY > 0 ? 1 : -1;
    } else if (Math.abs(offsetY) > 174) {
      vNum = offsetY > 0 ? 2 : -2;
    }
    let moveIndex = index + hNum + vNum * 3;
    let itemOne = picture[index];
    let itemTwo = picture[moveIndex];
    picture.splice(moveIndex, 1, itemOne);
    picture.splice(index, 1, itemTwo);
    this.setData({ picture, activeMoveViewIndex: index, activeMoveX: 0,activeMoveY: 0 })
  },
  // 跟调（也就是提交）
  follow: function () {
    const { themeId, content, picture } = this.data;
    let studentId = app.globalData.studentId;
    if (_.isEmpty(content)) {
      wx.showToast({
        title: '跟调内容不能为空',
      })
      return;
    }
    wx.showLoading({
      title: '提交中',
    })
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
        if (_.get(res, 'data.code') === 200) {
          wx.showToast({
            title: '跟调成功',
            success: res => {
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