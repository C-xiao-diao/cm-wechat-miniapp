Component({
    properties: {
        showBtn: {
            type: Boolean,
            value: false
        }
    },
    data: {
        showList: false
    },
    lifetimes: {
        // 在组件实例进入页面节点树时执行
        attached: function() {
            let showBtn = this.properties.showBtn;
            console.log(showBtn,9999999999)
            this.setData({ showList: showBtn }) 
        }
    },
    methods: {
        showListOrNot: function(){
            let showList = !this.data.showList;
            this.setData({showList});
        }
    }
})