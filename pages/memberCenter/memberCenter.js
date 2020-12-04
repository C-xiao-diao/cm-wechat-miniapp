import "./../../utils/fix";
import _ from "./../../utils/lodash";
import config from "./../../configs/config";
import { http } from "./../../utils/util";
import moment from "./../../utils/moment";

//获取应用实例
const app = getApp()

Page({
    data: {
        avatarList: [],
        userInfo: {},
        showModal: false,
        showEditModal: false,
        currentTab: 0,
        showBtn: true,
        // 起调
        themeCount: 0,
        themePage: 0,
        themePageLimit: 5,
        myThemeList: [],
        //跟调
        followCount: 0,
        followPage: 0,
        followPageLimit: 5,
        myFollowList: [],
        floorstatus: false,
        noteMsg: '',
        ifSelf: true,
        option: {}
    },
    onLoad: function(option){
        let studentId = app.globalData.studentId;
        if(option){
            if(option.type == 'self' && option.studentId == studentId){//浏览个人主页
                this.setData({option, ifSelf: true})
                this.getStudentInfo(app.globalData.studentId);
                this.getMyTheme(app.globalData.studentId, this.data.themePage);
            }else{//他人主页
                this.setData({option, ifSelf: false});
                this.getStudentInfo(option.studentId);
                this.getMyTheme(option.studentId, this.data.themePage);
            }
        }
    },
    onShow: function(){
        this.refreshMyTheme();
        this.refreshMyFollow();
    },
    //获取"更多"按钮
    getMoreBtns: function(list, type){
        const { ifSelf } = this.data;
        if(!ifSelf){ return; }
        for( let i = 0 ;i < list.length; i++){
            let str = 'more' + type + 'Btn' + i;
            this[str] = this.selectComponent('#'+str);
        }
    },
    //获取学生信息
    getStudentInfo: function(studentId){
        let cmd = "/auth/student/getById";
        let data = { studentId }
        http.get({
            cmd,
            data:data,
            success: res => {
                if (_.get(res, 'data.code') === 200 && !_.isEmpty(_.get(res, 'data.data'))) {
                    let resData = _.get(res, 'data.data');
                    let userInfo = resData.studentInformation;
                    this.setData({userInfo});
                }
            }
        })
    },
    //刷新我的起调列表
    refreshMyTheme: function(){
        const { themePage, ifSelf, option } = this.data;
        if(ifSelf){
            this.getMyTheme(app.globalData.studentId, themePage);
        }else {
            this.getMyTheme(option.studentId, themePage);
        }
    },
    //刷新我的跟调列表
    refreshMyFollow: function(){
        const { followPage, ifSelf, option } = this.data;
        if(ifSelf){
            this.getMyFollow(app.globalData.studentId, followPage);
        }else {
            this.getMyFollow(option.studentId, followPage);
        }
    },
    //获取 我的起调 列表
    getMyTheme: function(studentId, page){
        const { themePageLimit, myThemeList, followPage } = this.data;
        let cmd = "/auth/theme/myTheme";
        let data = {
            studentId: studentId,
            limit: themePageLimit,
            page: page
        }
        http.get({
            cmd,
            data:data,
            success: res => {
                if (_.get(res, 'data.code') === 200 && !_.isEmpty(_.get(res, 'data.data'))) {
                    let resData = _.get(res, 'data.data');
                    let list = page > followPage ? list = myThemeList : [];
                    for(var i = 0; i < resData.list.length; i++){
                        list.push(resData.list[i]);
                        if(list[i].releaseTime){
                            let isToday = moment(list[i].releaseTime).isSame(moment(),'day');
                            if(isToday){
                                list[i].releaseTime = moment(list[i].releaseTime).format("HH:mm");
                            }
                        }
                    }
                    let themeCount = resData.count;
                    this.setData({ myThemeList: list, themeCount, themePage:page });
                    this.getMoreBtns(list,'Theme');
                }else if(_.get(res, 'data.code') === 107){
                    this.setData({ noteMsg: _.get(res, 'data.msg') || '暂无数据' })
                }
            }
        })
    },
    //跟调
    getMyFollow: function(studentId, page){
        const { followPageLimit, myFollowList, followPage } = this.data;
        let cmd = "/auth/essay/myEssay";
        let data = {
            studentId: studentId,
            limit: followPageLimit,
            page: page
        }
        http.get({
            cmd,
            data:data,
            success: res => {
                wx.hideLoading();
                if (_.get(res, 'data.code') === 200 && !_.isEmpty(_.get(res, 'data.data'))) {
                    let resData = _.get(res, 'data.data');
                    let list = page > followPage ? list = myFollowList : [];
                    for(var i = 0; i < resData.list.length; i++){
                        list.push(resData.list[i]);
                        if(list[i].releaseTime){
                            let isToday = moment(list[i].releaseTime).isSame(moment(),'day');
                            if(isToday){
                                list[i].releaseTime = moment(list[i].releaseTime).format("HH:mm");
                            }
                        }
                    }
                    let followCount = resData.count;
                    this.setData({ myFollowList: list, followCount, followPage:page });
                    this.getMoreBtns(list, 'Follow');
                }else if(_.get(res, 'data.code') === 107){
                    this.setData({ noteMsg: _.get(res, 'data.msg') || '暂无数据' })
                }
            }
        })
    },
    //页面上拉触底事件
    onReachBottom: function(){
        const { currentTab, themeCount, themePageLimit, themePage, followCount, followPageLimit, followPage } = this.data;
        if(currentTab==0){//起调页面
            let pages = Math.ceil(themeCount/themePageLimit) - 1;
            if(themePage < pages){
                wx.showLoading({ title: '加载中...'});
                let curFollowPage = themePage + 1;
                this.getMyTheme(app.globalData.studentId, curFollowPage);
            }
        }else if(currentTab==1){//跟调页面
            let pages = Math.ceil(followCount/followPageLimit) - 1;
            if(followPage < pages){
                wx.showLoading({ title: '加载中...'});
                let curFollowPage = followPage + 1;
                this.getMyFollow(app.globalData.studentId, curFollowPage);
            }
        }
    },
    //跳转音符规则页面
    toInvite: function(){
        wx.navigateTo({ url: '../invite/invite' });
    },
    //修改图片
    headimage: function () {
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
                        let resData = JSON.parse(json)
                        if (_.get(resData, 'code') === 200) {
                            let fileName = _.get(resData, 'data.fileName');
                            let file = fileName[0];
                            _this.setData({ 
                                'userInfo.headimgUrl': file,
                             });
                             app.globalData.userInfo.headimgUrl = file;
                             _this.editAvatar(file)
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
    //修改用户头像
    editAvatar: function(headimgUrl){
        const { userInfo } = this.data;
        let cmd = "/auth/student/editStudent";
        let studentId = app.globalData.studentId;
        let data = {
            studentId,
            headimgUrl,
            nickname: userInfo.nickname,
        }
        http.get({
            cmd,
            data,
            success: res => {
                if (_.get(res, 'data.code') === 200) {
                    wx.showToast({
                        title: '操作成功',
                    })
                }
            }
        })
    },
    //预览图片
    previewImage: function(e){
        let index = e.currentTarget.dataset.index;
        let src = e.currentTarget.dataset.src;
        if(typeof src == 'string'){
            wx.previewImage({
                current: src, 
                urls: [src], 
                success: function(){}
            })
        }else{
            wx.previewImage({
                current: src[index], 
                urls: src,
                success: function(){}
            })
        }
    },
    //tab切换
    swichNav: function( e ) {
        const { themePage, followPage, ifSelf, option } = this.data;
        if( this.data.currentTab === e.target.dataset.current ) {
            return false;
        } else {
            let currentTab = e.target.dataset.current;
            if(currentTab==0 && ifSelf){
                this.getMyTheme(app.globalData.studentId, themePage);
            }else if(currentTab==1 && ifSelf){
                this.getMyFollow(app.globalData.studentId, followPage);
            }else if(currentTab==0 && !ifSelf){
                this.getMyTheme(option.studentId, themePage);
            }else if(currentTab==1 && !ifSelf){
                this.getMyFollow(option.studentId, followPage);
            }
            this.setData({ currentTab })
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
        const { ifSelf, currentTab, myThemeList, myFollowList } =  this.data;
        if(!ifSelf){ return; }
        if(currentTab==0){//起调
            for( let i = 0 ;i < myThemeList.length; i++){
                let str = 'moreThemeBtn' + i;
                this[str].showListFn(true);
            }
        }else{
            for( let i = 0 ;i < myFollowList.length; i++){
                let str = 'moreFollowBtn' + i;
                this[str].showListFn(true);
            }
        }
    },
    //跳转内容页面
    navToForumList: function(e){
        let themeId = e.currentTarget.dataset.themeid;
        let index = e.currentTarget.dataset.index;
        let theme = e.currentTarget.dataset.theme;
        let number = e.currentTarget.dataset.number;
        let picture = e.currentTarget.dataset.picture;
        let content = e.currentTarget.dataset.content;
        wx.navigateTo({ 
            url: '../forumList/forumList?themeId=' + themeId +
            '&index=' + index +
            '&theme=' + theme +
            '&number=' + number +
            '&picture=' + JSON.stringify(picture) +
            '&content=' + content 
        });
    },
    //获取滚动条当前位置
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