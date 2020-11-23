Component({
    lifetimes: {
        // 在组件实例进入页面节点树时执行
        attached: function() {
            
        }
    },
    data: {
        showList: false
    },
    methods: {
        showListOrNot: function(){
            let showList = !this.data.showList;
            this.setData({showList});
        }
    }
})