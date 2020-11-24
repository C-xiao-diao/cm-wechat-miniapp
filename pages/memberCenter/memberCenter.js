Page({
    data: {
        avatar: '/imgs/forumList/avatar.jpg',
        showModal: false,
        currentTab: 0,
        nickname: '一天一天'
    },
    //跳转音符规则页面
    toInvite: function(){
        wx.navigateTo({
            url: '../invite/invite'
        });
    },
    //修改图片
    headimage: function () {
        var  _this = this;
        wx.chooseImage({
           count: 1, // 默认9     
           sizeType: ['original', 'compressed'],
          // 指定是原图还是压缩图，默认两个都有     
           sourceType: ['album', 'camera'],
          // 指定来源是相册还是相机，默认两个都有   
           success: function (res) {   
             _this.setData({
               head: res.tempFilePaths
            })
          }
        })
    },
    //tab切换
    swichNav: function( e ) {
        var that = this;
        if( this.data.currentTab === e.target.dataset.current ) {
            return false;
        } else {
            that.setData( {
                currentTab: e.target.dataset.current
            })
        }
    },
    //编辑昵称
    editNickname: function(){
        
    }
})