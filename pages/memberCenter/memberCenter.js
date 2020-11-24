Page({
    data: {
        avatar: '/imgs/forumList/avatar.jpg',
        avatarList: [],
        showModal: false,
        showEditModal: false,
        currentTab: 0,
        nickname: '一天一天',
        showBtn: true
    },
    onReady: function(){
        this.moreBtn = this.selectComponent('#moreBtn');
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
                avatar: res.tempFilePaths
            })
          }
        })
    },
    //预览照片
    previewImage: function(e){
        const { avatar } = this.data;
        wx.previewImage({
            current: avatar, // 当前显示图片的http链接
            urls: [avatar], // 需要预览的图片http链接列表
            success: function(){
                console.log('预览成功');
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
    //打开编辑昵称
    editNickname: function(){
        this.setData({showEditModal: true});
    },
    //取消编辑昵称
    editCancel: function(){
        this.setData({showEditModal: false});
    },
    //确认编辑昵称
    editConfirm: function(){
        this.setData({showEditModal: false});
    },
    //关闭选项列表
    closeList: function(){
        this.moreBtn.showListOrNot();
    }
})