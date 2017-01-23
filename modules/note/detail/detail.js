/**
 * Created by caojie on 2017/1/14.
 * 笔记详情
 */
const app =getApp();
const path = "../../../common/";
const {noticeHelper,payHelper,commentHelper,noteCollectHelper} = require(path+"handle.js").handlers;
const http = require(path+"http.js").http;
const urls = require(path+"const.js").const.url;
const {noteCommentList} =  require(path+"data.js").dataHepler;
const WxParse = require('../../../resources/lib/wxParse/wxParse.js');
const {common,dateUtil,windowHelper} = require(path+"utils.js")
let page = {
    data: {
        "winHeight": app.globalData.systemInfo.windowHeight,
        "noteid": null,//id,
        "noMore":false,//没有更多数据
        "note": {},//详情
        "commentList": []//评论列表
    },
    getNoteDetail: function (noteid = this.data.noteid) {
        http.get(urls.note_detail, {noteid: noteid}).then(res => {
            wx.stopPullDownRefresh();
            let note = res.data;
            //格式化日期
            dateUtil.formatDateForObject(note,"note_time");
            var that = this;
            WxParse.wxParse('note_content', 'html', note.note_content, that,5);
            WxParse.wxParse('free_note_content', 'html', note.free_note_content, that,5);
            this.setData({"note": res.data});
        });
    },
    getNoteComment: function (noteid=this.data.noteid) {
        this.commentList = this.commentList || new noteCommentList(noteid);
        !this.data.noMore &&
        this.commentList.nextPage(data => {
            if(data.length == this.data.commentList.length){
                this.setData({noMore:true});
            }else{
                dateUtil.formatDateForObjects(data,"createTime");
                this.setData({"commentList": data})
            }
        });
    },
    onLoad: function (option) {
        common.copy(commentHelper,this);
        this.setData({noteid:option.noteid});
        this.getNoteDetail();
        this.getNoteComment();
    },
    //-------付费-------
    notePay: function () {
        let total_fee = this.data.note.note_price;
        let param = {
            noteid :this.data.noteid,
            totalFee:total_fee
        }
        new payHelper(urls.note_pay,param,total_fee).pay(res=> {
            let content = res.data.note_content;
            var that = this;
            WxParse.wxParse('note_content', 'html', content, that,5);
            this.data.note.note_content = content;
            this.data.note.authority = 1;
            this.setData({"note":this.data.note});
        });
    },
    //-------收藏--------
    collect:function () {
        noteCollectHelper.collect(this.data.noteid).then(res=>{
            this.data.note.mycollected = 1;
            this.setData({note:this.data.note});
        });
    },
    //------取消收藏-----
    cancelCollect:function () {
        noteCollectHelper.cancel(this.data.noteid).then(res=>{
            this.data.note.mycollected = 0;
            this.setData({note:this.data.note});
        });
    },
    //-------关注----------
    notice: function(e){
        let answer_id = e.currentTarget.dataset.userid
        noticeHelper.notice(answer_id).then(()=> {
            this.data.note.mynoticed = 1;
            this.setData({"note":this.data.note});
        });
    },
    //--------点赞-------
    support: function () {
        http.get(urls.note_support, {noteid: this.data.noteid}).then(()=> {
            windowHelper.popSuccess("感谢您的支持");
            this.data.note.mysatisfied = 1;
            this.data.note.satisfied_nums +=1;
            this.setData({"note":this.data.note});
        });
    },
    //--------评论点赞-----
    commentAgree:function (e) {
        let cmtid = e.currentTarget.dataset.cmtid;
        let comment = this.data.commentList.find(item => item.id == cmtid);
        if(comment.iBest == 1){
            windowHelper.popWrong("您已经赞过啦");
            return;
        }
        http.get(urls.comment_agree,{commentid:cmtid}).then(()=>{
            comment.bestNum  += 1;
            comment.iBest = 1;
            this.setData({commentList:this.data.commentList});
        });
    },
    //发表评论
    noteComment:function(e){
        let {level,parentcommentid} = e.currentTarget.dataset;
        this.setData({
            commentLevel:level,
            parentCommentid:parentcommentid
        });
        this.popup();
    },
    //-------加载更多-------
    onReachBottom: function(){
        !this.noMore && this.getNoteComment()
    },
    onPullDownRefresh:function () {
        this.commentList = null;
        this.getNoteDetail();
    }
}



Page(page);
