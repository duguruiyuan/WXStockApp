/**
 * Created by caojie on 2017/1/14.
 * 大咖详情
 */
const path = "../../../common/";
const {noticeHelper,questionHelper} = require(path + "handle.js").handlers;
const http = require(path + "http.js").http;
const urls = require(path + "const.js").const.url;
const {noteList, questionList} =  require(path + "data.js").dataHepler;
const {common} = require(path+"utils");
let page = {
    data: {
        "tabs": ["笔记", "问股", "课程"],
        "activeIndex": "0",//当前激活tab 的index
        "sliderOffset": 0,
        "sliderLeft": 16,
        "noMore": false,//没有更多数据
        "userid": null,//大咖用户id
        "bigname": {},//大咖详情
        "noteList": [],//笔记列表
        "questionList": [],//问股列表
        "courseList": [],//课程列表
    },
    //------获取大咖详情-------
    getBignameDetail: function (userid) {
        http.get(urls.bigname_detail, {userid: userid}).then(
            ({data:data} = res) => {
                //将擅长变为数组
                data.good_at = data.good_at && data.good_at.toString().split(",");
                this.setData({"bigname": data})
            }
        )
    },
    //-------获取大咖笔记----
    getNoteList: function (authorid = this.data.userid) {
        this.noteList = this.noteList || new noteList(1, 4, authorid);
        !this.data.noMore &&
        this.noteList.nextPage((data) => {
            wx.stopPullDownRefresh();
            data.length == this.data.noteList.length
            && this.setData({noMore: true});
            this.setData({noteList: data})
        });
    },
    //-------获取大咖课程 ----
    getCourseList: function (authorid = this.data.userid) {
        this.courseList = this.courseList || new noteList(2, 4, authorid);
        !this.data.noMore &&
        this.courseList.nextPage((data) => {
            data.length == this.data.courseList.length
            && this.setData({noMore: true});
            this.setData({courseList: data});
        });
    },
    //-------获取大咖问股---------
    getQuestionList: function (answerid = this.data.userid) {
        this.questionList = this.questionList || new questionList(5, answerid);
        !this.data.noMore &&
        this.questionList.nextPage(data => {
            data.length == this.data.questionList.length
            && this.setData({noMore: true});
            this.setData({questionList: data});
        })
    },
    onLoad: function (option) {
        common.copy(questionHelper,this);
        let userid = option.userid;
        this.setData({userid: userid})
        this.getBignameDetail(userid);
        this.getNoteList(userid);
    },
    //加关注
    notice: function () {
        let {userid:userid, mynoticed:isNoticed} = this.data.bigname;
        if (isNoticed == 0) {
            noticeHelper.notice(userid).then(()=> {
                this.data.bigname.mynoticed = 1;
                this.data.bigname.user_noticer_nums += 1;
                this.setData({bigname: this.data.bigname});
            });
        } else {
            this.cancelNotice(userid);
        }
    },
    //取消关注
    cancelNotice: function (userid) {
        noticeHelper.cancel(userid).then(()=> {
            this.data.bigname.user_noticer_nums -= 1;
            this.data.bigname.mynoticed = 0;
            this.setData({bigname: this.data.bigname});
        });
    },
    //------切换tab---------
    tabClick: function (e) {
        let activeIndex = e.currentTarget.id;
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id,
            noMore: false
        });
        let userid = this.data.userid;
        if (activeIndex == 0) {
            !this.data.noteList.length && this.getNoteList(userid);
        } else if (activeIndex == 1) {
            !this.data.questionList.length && this.getQuestionList(userid);
        } else if (activeIndex == 2) {
            !this.data.courseList.length && this.getCourseList(userid);
        }
    },
    //----加载更多-----
    onReachBottom: function () {
        if (this.data.noMore) {
            return;
        }
        let activeIndex = this.data.activeIndex;
        if (activeIndex == 0) {
            this.getNoteList()
        } else if (activeIndex == 1) {
            this.getQuestionList();
        } else if (activeIndex == 3) {
            this.getCourseList();
        }
    },
    //上拉重新加载
    onPullDownRefresh:function () {
        this.noteList = null;
        this.questionList = null;
        this.courseList = null;
        this.getNoteList();
    }
}

Page(page);

