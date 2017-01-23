/**
 * Created by cj on 2017/1/14.
 * 问股详情
 */
const path = "../../../common/";
const {noticeHelper, payHelper,questionCollectHelper} = require(path+"handle.js").handlers;
const http = require(path + "http.js").http;
const urls = require(path + "const.js").const.url;
const {dateUtil,windowHelper} = require(path+"utils.js");
let page = {
    data: {
        "questionid": null,
        "question": {},
        "init":true,//初始化状态
        "playStatus":"stop"// stop play
    },
    getQuestionDetail: function (questionid = this.data.questionid) {
        http.get(urls.question_detail, {questionid: questionid}).then(res=> {
            dateUtil.formatDateForObject(res.data,"question_time");
            dateUtil.formatDateForObject(res.data,"answer_time");
            this.setData({question: res.data});
        });
    },
    onReady: function (e) {
        // 使用 wx.createAudioContext 获取 audio 上下文 context
        this.audioCtx = wx.createAudioContext('questionAudio');
    },
    onLoad: function (option) {
        this.setData({questionid:option.questionid});
        this.getQuestionDetail();
    },
    //-------超值---------
    support: function (e) {
        http.get(urls.question_support, {questionid: this.data.questionid}).then(res=> {
            windowHelper.popSuccess("感谢您的支持");
            this.data.question.mysatisfied = 1;
            this.data.question.satisfied_nums +=1
            this.setData({question: this.data.question});
        });
    },
    //-------关注----------
    notice: function(e){
        let answer_id = e.currentTarget.dataset.userid
        noticeHelper.notice(answer_id).then(()=> {
            this.data.question.mynoticed = 1;
            this.setData({"question":this.data.question});
        });
    },
    //-------收藏--------
    collect:function () {
        questionCollectHelper.collect(this.data.questionid).then(res=>{
            this.data.question.mycollected = 1;
            this.setData({question:this.data.question});
        })
    },
    //------取消收藏-----
    cancelCollect:function () {
        questionCollectHelper.cancel(this.data.questionid).then(res=>{
            this.data.question.mycollected = 0;
            this.setData({question:this.data.question});
        })
    },
    clickQuestion:function () {
      let status =  this.data.playStatus;
      //如果停止，就播放
      if(status == "stop" || status =="pause"){
        this.play();
      }else if(status == "play"){
        this.pause();
      }
    },
    //-------付费-------
    pay: function (cb) {
        let {questionid:questionid, listen_price:totalFee} = this.data.question;
        let param = {
            questionid:questionid,
            totalFee:totalFee
        }
        new payHelper(urls.question_pay,param,totalFee).pay((res)=> {
            let data = res.data;
            this.data.question.prem = 3;//权限变为已经看过
            this.data.question.answer_oss_url = data.answer_oss_url;//赋值url
            this.setData({question: this.data.question});
            this.audioCtx.setSrc(data.answer_oss_url);
            this.audioCtx.play();
            this.setData({playStatus:"play",init:false});
            typeof cb == "function" && cb(data);
        });
    },
    //-----付费听,或者直接播放------
    play: function () {
        let prem = this.data.question.prem;
        if (Number.parseInt(prem) === 1) {
            //需要付费
            this.pay();
        } else {
            //不需要付费,直接播放
            this.audioCtx.play();
            this.setData({playStatus:"play",init:false});
        }
    },
    //暂停播放
    pause:function(){
        this.audioCtx.pause()
        this.setData({playStatus:"pause"});
    },
    //进度
    progress:function (e) {
        let {currentTime,duration} = e.detail;
        this.setData({
            display:"inline",
            currentTime:Number.parseInt(duration)-Number.parseInt(currentTime),
        });
    },
    //播放结束
    stop:function () {
        this.setData({playStatus:"stop"});
    },
    //播放失败
    error:function () {
        wx.showModal({title: "错误",content:"网络异常，请稍后重试",showCancel:false});
    }
}

Page(page);
