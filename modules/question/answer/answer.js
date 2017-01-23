/**
 * 问股回答
 */
const path = "../../../common/";
const http = require(path + "http.js").http;
const urls = require(path + "const.js").const.url;
const utils = require(path + "utils.js");
const dateUtil = utils.dateUtil;
Page({
    data: {
        "questionid": 102,//问股id
        "question": {},//问股详情，
        "state": "startRecord",//录音的状态 startRecord、stopRecord、startListen、stopListen,reRecord
        "audioLen": 0,
        "timeInterval": {},//计时器引用,
        "tempFilePath":null//录音文件临时地址
    },
    getQuestionDetail(questionid = this.data.questionid){
        http.get(urls.question_detail, {questionid: questionid}).then(res=> {
            let data = res.data;
            dateUtil.formatDateForObject(data, "question_time");
            this.setDate({question: data});
        });
    },
    onLoad: function (option) {
        //const questionid = option.questionid;
        //this.setData({questionid:questionid});
        this.getQuestionDetail();
    },
    //开始录音
    startRecord: function () {
        let that = this;
        this.setData({state: "stopRecord"});
        console.log("开始录音");
        wx.startRecord({
            success: function (res) {
                //如果大于一分钟，则自动停止录音
                that.data.audioLen >= 1 && that.stopRecord();
                that.data.timeInterval = setInterval(function () {
                    that.setData({audioLen: that.data.audioLen += 1})
                }, 1000);
                that.data.tempFilePath = res.tempFilePath;
            },
            fail: function (ex) {
                that.data.audioLen >= 1 && that.stopRecord();
                that.data.timeInterval = setInterval(function () {
                    that.setData({audioLen: that.data.audioLen += 1})
                }, 1000);
            }
        });
    },
    //停止录音
    stopRecord: function () {
        let that = this;
        wx.stopRecord({
            success: function (res) {
                console.log("stopOk");
                this.setData({state: "startListen"});
                clearInterval(that.data.timeInterval);
            },
            fail: function (res) {
                console.log("stopFail");
                clearInterval(that.data.timeInterval);
            }
        })
    },
    //试听
    startListen:function () {
        let that = this;
        wx.playVoice({
            filePath:that.data.tempFilePath,
            success:function () {
              setInterval(function () {

              },1000)
            }
        });
    },
    //停止试听
    stopListen:function () {

    },
    //重录
    reRecord:function () {
        this.setData({
            audioLen:0,
            state:"startRecord",
            tempFilePath:null
        });
    }

});