import "./../../utils/fix";
import _ from "./../../utils/lodash"
import { http } from "./../../utils/util";
import config from "./../../configs/config"

//获取应用实例
const app = getApp()

Page({
    data: {
        openCamera: false,
        idCardNumber: '',
        name: '',
        schoolId: '',
        schoolName: '',
        faceImageUrl: ''
    },
    onLoad: function (option) {
        console.log(option)
        this.setData({
            idCardNumber: option.idCardNumber,
            name: option.name,
            schoolId: option.schoolId,
            schoolName: option.schoolName,
        })
    },
    onShow: function () {

    },
    takePhoto: function () {
        const _this = this;
        const idCardNumber = this.data.idCardNumber;
        const ctx = wx.createCameraContext()
        ctx.takePhoto({
            quality: 'high',
            success: (res) => {
                // tempFilePath可以作为img标签的src属性显示图片
                const tempImagePath = res.tempImagePath;

                console.log(res, 11111111111555555555555555555555555555555555555555555);
                //上传至服务器
                wx.showLoading({ title: '正在上传...' });
                wx.uploadFile({
                    url: config.uploadIdentifyFaceUrl,
                    filePath: tempImagePath,
                    header: {
                        'content-type': 'multipart/form-data'
                    },
                    name: 'files',
                    formData: {
                        'idCardNumber': idCardNumber
                    },
                    success(res) {
                        console.log(res, 'fffffffffffffffffffffffffffffffffffffffffff')
                        let json = res.data;
                        let resData = JSON.parse(json)
                        if (_.get(resData, 'code') === 200) {
                            let fileName = _.get(resData, 'data.fileName');
                            let file = fileName[0];
                            _this.setData({ faceImageUrl: file });
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
    error: function (e) {
        console.log(e.detail, 'lllllllllllllllllllll')
    }
})