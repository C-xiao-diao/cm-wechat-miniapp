
Page({
    data: {

    },
    onShareAppMessage: function (e) {
        let timestamp = Date.parse(new Date());
        let date = new Date(timestamp);
        return {
            title: `邀请好友`,
            path: '/pages/index/index?sendUid=' + app.globalData.id,
            imageUrl: ''
        }
    }
})