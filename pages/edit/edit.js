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
        articleType: '',
        textLength: 0
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
        let oldPicture = this.data.oldPicture;
        let num = (9 - oldPicture.length);
        if(num<=0){
            wx.showToast({
                title: '最多只能添加9张图片',
                icon: 'none',
                duration: 1500
            });
            return;
        }
        //获取图片
        wx.chooseImage({
            count: num,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                // tempFilePath可以作为img标签的src属性显示图片
                const tempFilePaths = res.tempFilePaths;
                console.log(res.tempFilePaths,8888888888)
                //上传至服务器
                wx.showLoading({ title: '正在上传...'});
                _this.upLoadFile(tempFilePaths)
            }
        })
    },
    //上传图片
    upLoadFile: function(tempFilePaths){
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
                    let picture = _this.data.picture;
                    let pics = _.uniq(_.concat(picture, fileName));
                    for(var i = 0; i < pics.length; i++){
                        oldPicture.push(pics[i]);
                    }
                    _this.setData({picture: pics, oldPicture});
                    if(num<=0){
                        wx.hideLoading();
                    }else{

                    }
                }
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
                    let title = '', oldContent = '', oldPicture = [];
                    if(articleType == "theme"){
                        title = resData.theme.theme;
                        oldContent = resData.theme.supplementaryContent;
                        oldPicture = resData.theme.picture;
                    }else{
                        oldContent = resData.essay.content;
                        oldPicture = resData.essay.picture;
                    }
                    this.setData({ title, oldContent, oldPicture, articleType, articleId });
                    this.getTextLength(oldContent,articleType);
                }
            }
        })
    },
    //获取最多可输入字符长度
    getTextLength: function(oldContent,articleType){
        let length = oldContent.toString().length;
        const allowLength = articleType == "theme" ? 160 : 800;
        let textLength = (allowLength - length);
        this.setData({textLength});
    }
})