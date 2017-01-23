/**
 * Created by caojie on 2017/1/15.
 * 课程详情
 */
const path = "../../../common/";
const {noticeHelper,commentHelper,noteCollectHelper} = require(path+"handle.js").handlers;
const http = require(path+"http.js").http;
const urls = require(path+"const.js").const.url;
const {noteCommentList} =  require(path+"data.js").dataHepler;
const {common,dateUtil} = require(path+"utils.js");
let page = {
    data:{
        "noMore":false,
        "course":{},//课程
        "courseid":null,//id
        "commentList":[]
    },
    getCouseDetail: function (couseid = this.data.courseid) {
        http.get(urls.note_detail, {noteid: couseid}).then(res=>{
            wx.stopPullDownRefresh();
            let course = res.data;
            //格式化日期
            dateUtil.formatDateForObject(course,"note_time");
            //统一视频url 统一 http://xxxx;
            let url = course.note_video.toString();
            if(!url.startsWith("http://")){
                course.note_video = "http://"+url;
            }
            this.setData({"course":course});
        });
    },
    getCourseComment: function (couseid=this.data.noteid) {
        this.commentList = this.commentList || new noteCommentList(couseid);
        !this.data.noMore &&
        this.commentList.nextPage(data => {
            if(data.length == this.data.commentList.length){
                this.setData({noMore:true});
            }else{
                this.setData({"commentList": data})
            }
        });
    },
    onReady: function (res) {
        //获取video上下文
        this.videoContext = wx.createVideoContext('courseVideo');
    },
    onLoad: function (option) {
        common.copy(commentHelper,this);
        this.setData({"courseid":option.courseid})
        this.getCouseDetail();
        this.getCourseComment();
    },
    play:function () {
      this.videoContext.play();
    },
    //视频播放错误
    playError:function () {
        wx.showModal({title:"错误",content:"视频加载失败,请稍候重试",showCancel:false});
    },
    //-------收藏--------
    collect:function () {
        noteCollectHelper.collect(this.data.courseid).then(res=>{
            this.data.course.mycollected = 1;
            this.setData({course:this.data.course});
        });
    },
    //------取消收藏-----
    cancelCollect:function () {
        noteCollectHelper.cancel(this.data.courseid).then(res=>{
            this.data.course.mycollected = 0;
            this.setData({course:this.data.course});
        });
    },
    //--------点赞-------
    support: function () {
        http.get(urls.note_support, {noteid: this.data.courseid}).then(()=> {
            wx.showToast({title: "感谢您的支持", icon: "success", mask: true});
            this.data.course.mysatisfied = 1;
            this.data.course.satisfied_nums +=1;
            this.setData({"course":this.data.course});
        });
    },
    //--------评论点赞-----
    commentAgree:function (e) {
        let cmtid = e.currentTarget.dataset.cmtid;
        http.get(urls.comment_agree,{commentid:cmtid}).then(()=>{
            let comment = this.data.commentList.find(item => item.id == cmtid);
            comment.bestNum  += 1;
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
    //加关注
    notice: function(e){
        let userid = e.currentTarget.dataset.userid
        noticeHelper.notice(userid).then(()=> {
            this.data.course.mynoticed = 1;
            this.data.course.noticer_nums +=1;
            this.setData({"course":this.data.course});
        });
    },
    //-------加载更多-------
    onReachBottom: function(){
        !this.data.noMore && this.getCourseComment();
    },
    //上拉重新加载
    onPullDownRefresh:function () {
        this.commentList = null;
        this.getCouseDetail();
    }

}

Page(page);
