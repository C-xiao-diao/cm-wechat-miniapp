//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    loading: true,
    //---------start ----------
    list: [],
  },
  onLoad: function () {
    //获取界面数据
    setTimeout(() =>{this.setData({ list: [1, 1, 1, 1, 1, 1, 1, 1,  1, 1, 1, 2], loading: false })}, 3000)
  },
  // ---------------------- start ------------------------------
  onShareAppMessage: function (e) {

  },
  onReachBottom:function(e){
    console.log(11111111111111111111111111111111111);
  },
  // 点赞
  like: function(){
    
  },
  //跟调
  navToFollow: function(){
    wx.navigateTo({
      url: '/pages/follow/follow',
    })
  }
  // ----------------------  end --------------------------------
})
