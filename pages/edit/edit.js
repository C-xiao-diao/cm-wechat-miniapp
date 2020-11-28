import "./../../utils/fix";
import _ from "./../../utils/lodash";
import config from "./../../configs/config"
import { http } from "./../../utils/util";

//获取应用实例
const app = getApp()

Page({
    data: {
        title: '',
        oldContent: '',
        content: '',
        oldPicture: [],
        picture: [],
        articleId: '',
        articleType: ''
    },
    onLoad: function(option){
        if(option){
            let articleId = option.articleId;
            let articleType = option.articleType;
            this.getOldArticle(articleId,articleType);
        }
    },
    //取消
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
                            let oldPicture = _this.data.oldPicture;
                            for(var i = 0; i < pics.length; i++){
                                oldPicture.push(pics[i]);
                            }
                            console.log(pics, oldPicture)
                            _this.setData({picture: pics, oldPicture});
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
    //保存编辑
    saveEdit: function(){
        const { content, picture, articleType, articleId } = this.data;
        if(_.isEmpty(content)){
            wx.showToast({ title: '编辑内容不能为空~',icon:none })
            return;
        }
        let cmd = articleType == "theme" ? "/auth/theme/edit" : "/auth/essay/edit";
        let data = {};
        if(articleType == "theme"){
            data = { themeId: articleId, supplementaryContent: content, picture }
        }else{
            data = { essayId: articleId, content: content, picture }
        }

        http.post({
            cmd,
            data,
            success: res => {
                if(_.get(res, 'data.code')=== 200){
                    wx.showToast({
                        title: '编辑成功',
                        success: res =>{
                            wx.navigateBack({delta: 1})
                        }       
                    })
                }
            }
        })
    },
    //获取起调 
    getOldArticle: function(articleId, articleType){
        let cmd = articleType == "theme" ? "/auth/theme/getById" : "/auth/essay/getById"
        let data = articleType == "theme" ? { themeId: articleId } : { essayId: articleId };
        http.get({
            cmd,
            data: data,
            success: res => {
                if (_.get(res, 'data.code') === 200 && !_.isEmpty(_.get(res, 'data.data'))) {
                    let resData = _.get(res, 'data.data');
                    if(articleType == "theme"){
                        let title = resData.theme.theme;
                        let oldContent = resData.theme.supplementaryContent;
                        let oldPicture = resData.theme.picture;
                        this.setData({ title, oldContent, oldPicture, articleType, articleId });
                    }else{
                        let oldContent = resData.essay.content;
                        let oldPicture = resData.essay.picture;
                        this.setData({ oldContent, oldPicture, articleType, articleId });
                    }
                }
            }
        })
    }
})