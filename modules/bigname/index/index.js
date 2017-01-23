/**
 * Created by caojie on 2017/1/13.
 * 大咖首页
 */
const path = "../../../common/";
const {bignameList,recommendData} =  require(path+"data.js").dataHepler;
const {noticeHelper} = require(path+"handle.js").handlers;
const {common} = require(path+"utils.js");
//大咖顶部推荐位置
const POSITION_ID_TOP = 200101;
const page = {
    data:{
        "recData":[],//推荐大咖
        "allList":[],//所有大咖
        "hasMore":true,//是否还有更多数据
    },
    //========获取推荐数据========
    getRecList:function () {
        this.recData = this.recData || new recommendData(POSITION_ID_TOP);
        this.recData.nextPage( data => {
            wx.stopPullDownRefresh();
            //只取等于长度等于3的子数组
            data = common.splitArray(data,3).filter(item => item.length==3);
            this.setData({"recData":data});
        });
    },
    //========获取所有大咖列表=====
    getAllList:function () {
        this.bignameList = this.bignameList || new bignameList();
        this.bignameList.nextPage(data => {
            (this.data.allList.length == data.length)?this.data.hasMore=false:this.setData({"allList":data});
        });
    },
    onLoad:function () {
        this.getRecList();
        this.getAllList();
    },
    //关注用户
    notice:function (event) {
        let userid = event.currentTarget.dataset.userid;
        noticeHelper.notice(userid).then(()=> {
            let user = this.data.allList.find((item) => item.userid == userid);
            user.my_noticed = 1;
            user.user_notice_num +=1;
            this.setData({"allList":this.data.allList});
        });
    },
    cancelNotice:function(event){
       let userid = event.currentTarget.dataset.userid;
        noticeHelper.cancel(userid).then(()=> {
            let user = this.data.allList.find((item) => item.userid == userid);
            user.my_noticed = 0;
            user.user_notice_num -=1;
            this.setData({"allList":this.data.allList});
        });        
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
