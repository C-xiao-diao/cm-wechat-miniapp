Component({
    data: {
        showList: false
    },
    lifetimes: {
        // 在组件实例进入页面节点树时执行
        attached: function() {
            
        }
    },
    methods: {
        showListOrNot: function(){
            this.showListFn(false);
        },
        showListFn: function(fromParent){
            let showList;
            fromParent ? showList = false : showList = !this.data.showList;
            this.setData({showList});
        },
        //编辑
        editFn: function(){

        },
        //删除
        deleteFn: function(){

        },
        //转发
        shareFn: function(){

        }
    }
})