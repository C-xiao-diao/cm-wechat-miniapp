import "./../../utils/fix";
import _ from "./../../utils/lodash";
import { http } from "./../../utils/util";

//获取应用实例
const app = getApp()

Page({
    data: {
        userInfo: '',
        inviteCount: 0,
        inviteReword: 0,
        headimgUrlList: [''],
    },
    onLoad: function(){
        let userInfo = app.globalData.userInfo;
        if(userInfo){
            this.setData({userInfo});
        }
        this.getInviter();
    },
    onShareAppMessage: function (e) {
        // let timestamp = Date.parse(new Date());
        // let date = new Date(timestamp);
        // return {
        //     title: `邀请好友`,
        //     path: '/pages/index/index?sendUid=' + app.globalData.id,
        //     imageUrl: ''
        // }
    },
    //查看音符规则
    toRules: function(){
        wx.navigateTo({
            url: '../rules/rules'
        });
    },
    //获取受邀人列表
    getInviter: function(){
        let cmd = "/auth/cWechat/inviter";
        let data = { userId: app.globalData.userId }
        http.get({
            cmd,
            data:data,
            success: res => {
                if (_.get(res, 'data.code') === 200 && !_.isEmpty(_.get(res, 'data.data'))) {
                    let resData = _.get(res, 'data.data');
                    let inviteCount = resData.count;
                    let inviteReword = inviteCount * 200;
                    let headimgUrlList = resData.list;
                    this.setData({ inviteCount, inviteReword,headimgUrlList });
                }
            }
        })
    }
})