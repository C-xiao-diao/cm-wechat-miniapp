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
        console.log(option, 'optionoptionoptionoptionoptionoptionoptionoption')
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
                            _this.setData({ faceImageUrl: file }, () => {
                                _this.checkUserInfo()
                            });
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
    },

    //验证用户信息，保存学校，身份证号码等
    checkUserInfo: function () {
        wx.showLoading({ title: '正在验证...' });
        const studentId = app.globalData.studentId;
        const { schoolId, schoolName, idCardNumber, name, faceImageUrl } = this.data;
        let cmd = "/auth/verifyMaterial/verify";
        let data = { schoolId, idCardNumber, name, faceImageUrl, studentId };
        http.get({
            cmd,
            data,
            success: res => {
                if (_.get(res, 'data.code') === 200) {
                    //注册成功后，需要更新globleData里的 userInfo 信息
                    let userInfo = _.get(res, 'data.data.studentInformation');
                    userInfo.nickName = name;
                    userInfo.schoolName = schoolName;
                    userInfo.schoolId = schoolId;
                    // userInfo.headimgUrl = faceImageUrl;
                    app.globalData.studentName = userInfo.studentName;
                    app.globalData.studentId = userInfo.id;
                    app.globalData.reviewStatus = userInfo.reviewStatus;
                    app.globalData.userInfo = _.assign(app.globalData.userInfo, userInfo);
                    wx.showToast({
                        title: '认证成功',
                        icon: 'success',
                        duration: 2000
                    })
                    wx.redirectTo({
                        url: '/pages/index/index',
                    })
                } else if (_.get(res, 'data.code') === 103) {
                    wx.showModal({
                        title: '提示',
                        content: _.get(res, 'data.msg') || '操作失败',
                        success(res) {
                            if (res.confirm) {

                            } else if (res.cancel) {

                            }
                        }
                    })
                } else {
                    wx.showModal({
                        title: '提示',
                        content: _.get(res, 'data.msg') || '操作失败',
                        success(res) {
                            if (res.confirm) {

                            } else if (res.cancel) {

                            }
                        }
                    })
                }
            }
        })
    }
})