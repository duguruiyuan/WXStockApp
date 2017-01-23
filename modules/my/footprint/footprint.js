// modules/my/footprint/footprint.js
const path = "../../../common/";
const CONST = require(path + "const.js").const;
const {noteList, questionList} =  require(path + "data.js").dataHepler;
Page({
    data: {
        tabs: ["读过的", "看过的", "我问的", "我听的"],//默认选项卡
        activeIndex: 0,//当前激活选项 0:读过的，1看过的，2我问的，3我听的,4问我的,5我写的，
        sliderOffset:25,//tabs初始偏移量
        offsetIncremrnt:25,//偏移增量，随着tabs的增多而减小
        items: [],//列表数据
        hasMore:true//是否还有更多数据
    },
    initData: function (index = this.data.activeIndex) {
        index = Number.parseInt(index);
        let item = null;
        switch (index) {
            case 0://我读的
                item = new noteList(CONST.note_type.note, CONST.list_type.note.MY_READ);
                break;
            case 1://看过的
                item = new noteList(CONST.note_type.video, CONST.list_type.note.MY_READ);
                break;
            case 2://我问的
                item = new questionList(CONST.list_type.question.MY_ASK);
                break;
            case 3://我听的
                item = new questionList(CONST.list_type.question.MY_LISTEN);
                break;
            case 4://问我的
                item = new questionList(CONST.list_type.question.MY_ANSWER);
                break;
            case 5://我写的
                item = new noteList(CONST.note_type.note, CONST.list_type.note.MY_WRITE);
                break;
            default:
                item = new noteList(CONST.note_type.note, CONST.list_type.note.MY_READ);
        }
        this.item = item;
    },
    loadData: function () {
        //当数据不存在，则调用initData方法加载数据
        if (!this.item) {
            this.initData()
        }
        this.item.nextPage(data => {
            if(this.data.items.length == data.length){
                this.setData({hasMore:false});
            }
            this.setData({items:data});
        });
    },
    onLoad: function (option) {
        let userFlag = Number.parseInt(option.userFlag);
        //如果是大咖用户,则显示6个tab
        userFlag == 1 && this.setData({
            tabs: this.data.tabs.concat(["问我的", "我写的"]),
            sliderOffset:10,
            offsetIncremrnt:10
        });
        this.loadData();
    },
    tabClick:function (e) {
        this.item = null;//清空item 重新加载
        this.setData({
            activeIndex:e.currentTarget.id,
            sliderOffset: e.currentTarget.offsetLeft+this.data.offsetIncremrnt,
            hasMore:true
        });
        this.loadData();
    },
    onReachBottom:function(){
        this.data.hasMore && this.loadData();
    },
    //上拉重新加载
    onPullDownRefresh:function () {
        this.item = null;
        this.loadData();
    }
})