// modules/my/attention/attention.js
const path = "../../../common/";
const {bignameList,recommendData} =  require(path+"data.js").dataHepler;
const {noticeHelper} = require(path+"handle.js").handlers;
const {common} = require(path+"utils.js");
//大咖顶部推荐位置
const POSITION_ID_TOP = 200101;
const page = {
    data:{
        "recList":[],//推荐大咖
        "allList":[],//所有关注大咖
        "hasMore":true,//是否还有更多数据
        "isHave":false,//是否存在关注大咖（没有时，显示推荐大咖）
    },
    //========获取推荐数据========
    getRecList: function () {
        //有分页，需要添加分页的参数
        this.recList = this.recList || new recommendData(POSITION_ID_TOP, 1, 10);
        !this.data.noMore &&
        this.recList.nextPage(data => {
            if (data.length == this.data.recList.length) {
                this.setData({noMore: true});
            } else {
                this.setData({"recList": data});
            }
        })
    },
    //========获取关注大咖列表=====
    getAllList:function () {
        this.bignameList = this.bignameList || new bignameList(1);
        this.bignameList.nextPage(data => {
            (this.data.allList.length == data.length)?this.data.hasMore=false:this.setData({"allList":data});
            if(this.data.allList.length >= 1){
          this.setData({"isHave":true});
        }
        });
    },
    onLoad:function () {
        this.getRecList();
        this.getAllList();
        
    },

    //跳转用户详情
    toUserDetail:(event)=>{
        let userid = event.currentTarget.dataset.userid;
        wx.navigateTo({url:`../detail/detail?userid=${userid}`});
    },
    //下拉刷新
    onReachBottom:function () {
        this.data.hasMore && this.getAllList();
    },
    //上拉重新加载
    onPullDownRefresh:function () {
        this.bignameList = null;
        this.recData = null;
        this.getAllList();
        this.getRecList();
    }
}

Page(page);
