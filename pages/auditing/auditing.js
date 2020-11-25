import "./../../utils/fix";
import _ from "./../../utils/lodash"

Page({
    data: {
        openCamera: false,
    },
    onLoad: function () {
        
    },
    onShow: function () {
    
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
    error: function(e) {
        console.log(e.detail, 'lllllllllllllllllllll')
    }
})