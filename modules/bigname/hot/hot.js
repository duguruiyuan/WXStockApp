/**
 * Created by caojie on 2017/1/17.
 * 提问，热门大咖
 */
const path = "../../../common/";
const {recommendData, bignameList} =  require(path + "data.js").dataHepler;
const {questionHelper} = require(path + "handle.js").handlers;
const {common} = require(path+"utils.js");
//推荐id
const POSITION_ID_TOP = 200101;
Page({
    data: {
        "tabs": ["我的关注", "热门推荐"],//tabs
        "activeIndex": "0",//当前激活tab 的index
        "sliderOffset": 0,
        "sliderLeft": 45,
        "noMore": false,//是否还有更多数据
        "recList": [],//推荐列表
        "myNoticeList": []//我关注的列表
    },
    //获取我关注的列表
    getMyNoticeList: function () {
        //list_type = 1,获取我关注的
        this.bignameList = this.bignameList || new bignameList(1);
        //如果还有更多数据,则加载数据
        !this.data.noMore &&
        this.bignameList.nextPage(data => {
            wx.stopPullDownRefresh();
            //如果返回的数据长度和当前长度一致，则表明没有更多数据
            if (data.length == this.data.myNoticeList.length) {
                this.setData({noMore: true});
            } else {
                this.setData({myNoticeList: data});
            }
        });
    },
    getRecList: function () {
        //有分页，需要添加分页的参数
        this.recList = this.recList || new recommendData(POSITION_ID_TOP, 1, 10);
        !this.data.noMore &&
        this.recList.nextPage(data => {
            if (data.length == this.data.recList.length) {
                this.setData({noMore: true});
            } else {
                this.setData({recList: data});
            }
        })
    },
    onLoad: function () {
        common.copy(questionHelper, this);
        this.getMyNoticeList();
    },
    //切换tab
    tabClick:function (e) {
        let activeIndex = e.currentTarget.id;
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id,
            noMore: false
        });
        if (activeIndex == 0) {
            !this.data.myNoticeList.length && this.getMyNoticeList()
        } else if (activeIndex == 1) {
            !this.data.recList.length && this.getRecList();
        }
    },
    //刷新
    onReachBottom:function () {
        let activeIndex = this.data.activeIndex;
        if(!this.data.noMore){
            activeIndex == 0?this.getMyNoticeList():this.getRecList();
        }
    },
    //上拉重新加载
    onPullDownRefresh:function () {
        this.recList = null;
        this.bignameList = null;
        this.getMyNoticeList();
    },
    ask:function (e) {
        let {bigname} = e.currentTarget.dataset;
        this.setData({bigname:bigname});
        this.popup();
    }
});
