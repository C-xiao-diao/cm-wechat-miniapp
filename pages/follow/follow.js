//index.js
//获取应用实例
const app = getApp()

Page({
  data: {},
  onLoad(){

  },
  goBack: function(){
    wx.navigateBack();
  },
  // 添加内容
  addContent: function(){

  },
  // 选择图片
  addPhoto: function(){
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        console.log("111111111111111111111111111111",res)
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
      }
    })
  },
  // 跟调（也就是提交）
  follow: function(){

  }
})