import "./../../utils/fix";
import _ from "./../../utils/lodash"
import { http } from "./../../utils/util";

Component({
    properties: {
        propCount: {
          type: Number,
          default: 0
        },
        articleId: {
            type: String,
            default: ''
        },
        articleType: {
            type: String,
            default: ''
        }
    },
    data: {
        showList: false
    },
    lifetimes: {
        // 在组件实例进入页面节点树时执行
        attached: function() {
            
        }
    },
    methods: {
        showListOrNot: function(){
            this.showListFn(false);
        },
        showListFn: function(fromParent){
            let showList = fromParent ? false : !this.data.showList;
            if(!fromParent){
                this.triggerEvent('closeAll');
            }
            this.setData({showList});
        },
        //编辑
        editFn: function(){
            let articleId = this.properties.articleId;
            let articleType = this.properties.articleType;
            wx.navigateTo({ url: '../edit/edit?articleId=' + articleId + '&articleType=' + articleType});
        },
        //确认删除
        deleteConfirm: function(){
            let articleType = this.properties.articleType;
            let str = articleType == 'theme' ? '起调' : '跟调';
            let that = this;

            if(this.properties.propCount > 20) {
                wx.showToast({
                    title: '此条'+ str + '不可以删除',
                    duration: 1500,
                    icon: 'none'
                });
                return;
            }

            wx.showModal({
                title: '提示',
                content: '确定删除这条' + str + '吗？',
                showCancel: true,
                cancelText: '取消',
                cancelColor: '#000000',
                confirmText: '确定',
                confirmColor: '#3CC51F',
                success: (result) => {
                    if(result.confirm){
                        that.deleteFn();
                    }
                },
                fail: ()=>{},
                complete: ()=>{}
            });
        },
        //删除
        deleteFn: function(){
            let articleId = this.properties.articleId;
            let articleType = this.properties.articleType;
            let cmd = '';
            
            articleType == 'theme' ? cmd = "/auth/theme/delete" : cmd = "/auth/essay/delete";
            let data = { [articleType+'Id']: articleId};
            http.get({
                cmd,
                data:data,
                success: res => {
                    wx.hideLoading();
                    if (_.get(res, 'data.code') === 200) {
                        wx.showToast({
                            title: '删除成功！',
                            duration: 1500
                        });
                        this.triggerEvent('refresh');
                    }
                }
            })
        },
        //转发
        shareFn: function(){

        }
    }
})