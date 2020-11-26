import "./../../utils/fix";
import _ from "./../../utils/lodash"
import { http } from "./../../utils/util";

//获取应用实例
const app = getApp()

Page({
    data: {
        avatar: '/imgs/forumList/avatar.jpg',
        avatarList: [],
        showModal: false,
        showEditModal: false,
        currentTab: 0,
        nickname: '一天一天',
        showBtn: true,
        themePage: 0,
        floorstatus: false,
        myThemeList: [{count:12},{count:22},{count:1}]
    },
    onReady: function(){
        this.getMoreBtns();
    },
    onLoad: function(){
        this.getMyTheme();
    },
    //获取"更多"按钮
    getMoreBtns: function(){
        const { myThemeList } =  this.data;
        for( let i = 0 ;i < myThemeList.length; i++){
            let str = 'moreBtn' + i;
            this[str] = this.selectComponent('#'+str);
        }
    },
    //获取 我的起调 列表
    getMyTheme: function(){
        const { themePage } = this.data;
        let cmd = "/auth/theme/myTheme";
        let data = {
            studentId: 2,
            limit: 5,
            page: themePage
        }
        http.get({
            cmd,
            data:data,
            success: res => {
              if (_.get(res, 'data.code') === 200 && !_.isEmpty(_.get(res, 'data.data'))) {
                console.log(1111111)
              }
            }
        })
    },
    //页面上拉触底事件
    onReachBottom: function(){
        this.getMyTheme();
    },
    //跳转音符规则页面
    toInvite: function(){
        wx.navigateTo({ url: '../invite/invite' });
    },
    //修改图片
    headimage: function () {
        var  _this = this;
        wx.chooseImage({
           count: 1, // 默认9     
           sizeType: ['original', 'compressed'],
          // 指定是原图还是压缩图，默认两个都有     
           sourceType: ['album', 'camera'],
          // 指定来源是相册还是相机，默认两个都有   
           success: function (res) {   
             _this.setData({
                avatar: res.tempFilePaths
            })
          }
        })
    },
    //预览照片
    previewImage: function(e){
        const { avatar } = this.data;
        wx.previewImage({
            current: avatar, // 当前显示图片的http链接
            urls: [avatar], // 需要预览的图片http链接列表
            success: function(){
                // console.log('预览成功');
            }
        })
    },
    //tab切换
    swichNav: function( e ) {
        var that = this;
        if( this.data.currentTab === e.target.dataset.current ) {
            return false;
        } else {
            that.setData( {
                currentTab: e.target.dataset.current
            })
        }
    },
    //打开编辑昵称
    editNickname: function(){
        this.setData({showEditModal: true});
    },
    //获取用户输入修改后的昵称
    getNewNickname: function(e){
        let newNickname = e.detail.value;
        if(_.isEmpty(newNickname)){
            wx.showToast({ title: '昵称修改不能为空！' });
            return;
        }
        console.log(newNickname,999999)
    },
    //取消编辑昵称
    editCancel: function(){
        this.setData({showEditModal: false});
    },
    //确认编辑昵称
    editConfirm: function(){
        this.setData({showEditModal: false});
    },
    //关闭选项列表
    closeList: function(){
        const { myThemeList } =  this.data;
        for( let i = 0 ;i < myThemeList.length; i++){
            let str = 'moreBtn' + i;
            this[str].showListFn(true);
        }
    },
     // 获取滚动条当前位置
    onPageScroll: function (e) {
        if (e.scrollTop > 100) {
            this.setData({ floorstatus: true });
        } else {
            this.setData({ floorstatus: false });
        }
    },
    //回到顶部
    goTop: function (e) {  // 一键回到顶部
        if (wx.pageScrollTo) {
            wx.pageScrollTo({ scrollTop: 0 })
        } else {
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
            })
        }
    }
})