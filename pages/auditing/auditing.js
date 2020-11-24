import "./../../utils/fix";
import _ from "./../../utils/lodash"

Page({
    data: {

    },
    onLoad: function () {

    },
    onShow: function () {
        wx.getSetting({
            success(res) {
                let scope = res.authSetting;
                if (!scope.camera) {
                    wx.showModal({
                        title: '警告',
                        content: '若不授权使用摄像头，将无法使用拍照功能！',
                        cancelText: '不授权',
                        cancelColor: '#1ba9ba',
                        confirmText: '授权',
                        confirmColor: '#1ba9ba',
                        success: (res) => {
                            if (res.confirm) {//允许打开授权页面
                                //调起客户端小程序设置界面，返回用户设置的操作结果
                                wx.openSetting({
                                    success: (res) => {
                                        res.authSetting = {
                                            "scope.camera": true
                                        }
                                        this.openCamera = true
                                    },
                                })
                            } else if (res.cancel) {//拒绝打开授权页面
                                wx.navigateBack({ delta: 1 })
                            }
                        }
                    })
                }
            }
        })
    },
    takePhoto: function () {
        const ctx = wx.createCameraContext()
        ctx.takePhoto({
            quality: 'high',
            success: (res) => {
                console.log(res, 11111111111555555555555555555555555555555555555555555);
                // this.setData({
                //     src: res.tempImagePath
                // })
            }
        })
    },
    error(e) {
        console.log(e.detail, 'lllllllllllllllllllll')
        this.openCamera = false
        wx.showModal({
            title: '警告',
            content: '若不授权使用摄像头，将无法使用拍照功能！',
            cancelText: '不授权',
            cancelColor: '#1ba9ba',
            confirmText: '授权',
            confirmColor: '#1ba9ba',
            success: (res) => {
                if (res.confirm) {//允许打开授权页面
                    //调起客户端小程序设置界面，返回用户设置的操作结果
                    wx.openSetting({
                        success: (res) => {
                            res.authSetting = {
                                "scope.camera": true
                            }
                            this.openCamera = true
                        },
                    })
                } else if (res.cancel) {//拒绝打开授权页面
                    wx.navigateBack({ delta: 1 })
                }
            }
        })
    }
})