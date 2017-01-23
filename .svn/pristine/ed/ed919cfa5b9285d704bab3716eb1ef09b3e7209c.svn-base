/**
 * Created by cj on 2017/1/14.
 * 问股列表
 */
const path = "../../../common/";
const {questionList, recommendData} =  require(path + "data.js").dataHepler;
const {questionHelper} = require(path + "handle.js").handlers;
const {common} = require(path+"utils.js");
const POSITION_ID_QUESTION = 200104;
let page = {
    data: {
        "tabs": ["全部", "我的提问"],
        "activeIndex": "0",//当前激活tab 的index
        "sliderOffset": 0,
        "sliderLeft": 45,
        "noMore": false,
        "currentListName": "allList",//当前列表类型,默认全部
        "recData": [],//推荐
        "allList": [],//所有
        "myQuestions": [],//我的提问
        "currentList": 2//当前列表类型，默认全部
    },
    getRecData: function () {
        this.recData = this.recData || new recommendData(POSITION_ID_QUESTION);
        this.recData.nextPage(data => this.setData({recData: data}));
    },
    getQuestionList: function (listName = this.data.currentListName) {
        let listRefer = {"allList": 2, "myQuestions": 4}
        this[listName] = this[listName] || new questionList(listRefer[listName]);
        !this.data.noMore &&
        this[listName].nextPage(data => {
                wx.stopPullDownRefresh();
                if (data.length == this.data[listName].length) {
                    this.setData({"noMore": true});
                } else {
                    listName == "allList" ? this.setData({"allList": data}) : this.setData({"myQuestions": data});
                }
            }
        );
    },
    onLoad: function () {
        common.copy(questionHelper, this);
        this.getRecData();
        this.getQuestionList();
    },
    tabClick: function (e) {
        let activeIndex = e.currentTarget.id;
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id,
            noMore: false,
            currentListName: activeIndex == 0 ? "allList" : "myQuestions"
        });
        let needLoad = false;//是否需要重新加载数据
        if (activeIndex == 0) {
            needLoad = !this.data.allList.length;
        } else if (activeIndex == 1) {
            needLoad = !this.data.myQuestions.length;
        }
        needLoad && this.getQuestionList();
    },
    onReachBottom: function () {
        !this.data.noMore && this.getQuestionList();
    },
    onPullDownRefresh: function () {
        this.recData = null;
        this.allList = null;
        this.myQuestions = null;
        this.getQuestionList("allList");
    },
    //提问
    ask:function(e){
        let {bigname} = e.currentTarget.dataset;
        this.setData({bigname:bigname});
        this.popup();
    }
}


Page(page);
