var httpUtil = require('../../../common/http.js').http
var _const = require('../../../common/const.js').const
var util = require("../../../common/utils.js");
var handle = require("../../../common/handle.js")
Page({
    data: {
        code: 'sh601858',
        pno: 1,
        psize: 10,
        stockDiscussData: [],
        codeName: '中国科传',
        showPopup: false,
        isReply:false,
        popTitle: '',
        popContent: '',
        maxLength: 200,
        len: 0,
        content: '',
        stock_discuss_id:0,
    },
    onLoad: function (option) {
        // 页面初始化 options为页面跳转所带来的参数
        if (option.hasOwnProperty('name') || option.hasOwnProperty('code')) {
            this.setData({
                codeName: option.name,
                code: option.code
            })
        }
        this.getData()
    },
    getData: function () {///获取论股列表
        var that = this
        let params = {
            stockCode: this.data.code,
            pno: this.data.pno,
            psize: this.data.psize
        }
        httpUtil.get(_const.url.stockdiscuss_list, params).then(function (res) {
            if (res.data != null && res.data.length > 0) {
                for (var i = 0; i < res.data.length; i++) {
                    res.data[i].create_time = util.dateUtil.getAdjustDate(res.data[i].create_time);
                }
                that.setData({
                    stockDiscussData: res.data
                })
            }
        }.bind(this))
    },
    popup: function () {//论股弹窗
        this.setData({
            isReply:false,
            showPopup: true,
            popTitle: this.data.codeName,
            popContent: this.data.codeName + '(' + this.data.code + ')',
            len: this.data.maxLength - (this.data.codeName + '(' + this.data.code + ')').length,
        })
    },
    replyPopup: function (e) {//回复弹窗
        this.setData({
            isReply:true,
            showPopup: true,
            popTitle: '回复',
            popContent: '',
            len: 0,
            stock_discuss_id:e.currentTarget.id
        })
    },
    input: function (e) {//输入文字事件
        let value = e.detail.value;
        this.setData({
            len: this.data.maxLength - value.length,
            content: value
        });
    },
    send: function (e) {//保存论股消息
        var that = this
        var params = {
            stockCode: this.data.code,
            stockName: this.data.codeName,
            content: this.data.content,
        }
        httpUtil.post(_const.url.stockdiscuss_add, params).then(function (res) {
            if (res.errcode == 0) {
                closePopupRefreshData(res.errmessage,that)
            } else {
                showAlert(res.errmessage)
            }
        }.bind(this))
    },
    sendReply:function () {//保存回复消息
        var that = this
        var params = {
            stock_discuss_id: this.data.stock_discuss_id,
            content: this.data.content,
        }
        httpUtil.post(_const.url.stockdiscuss_reply_add, params).then(function (res) {
            if (res.errcode == 0) {
                closePopupRefreshData(res.errmessage,that)
            } else {
                showAlert(res.errmessage)
            }
        }.bind(this))
    },
    hide: function () {//影藏弹窗
        this.setData({
            len: 0,
            showPopup: false
        })
    },
    fabulous:function (e) {//论股点赞
        var that = this
        var params = {
            stock_discuss_id: e.currentTarget.id
        }

        httpUtil.post(_const.url.stockdiscuss_fabulous, params).then(function (res) {
            console.log(res)
            if (res.errcode == 0) {
                closePopupRefreshData(res.errmessage,that)
            }else {
                showAlert(res.errmessage)
            }
        }.bind(this))
    },
    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {
        // 页面显示
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    }
})
/**
 * 弹出提示框
 * @param message 弹窗内容
 */
function showAlert (message) {
    wx.showModal({
        title: '提示',
        content: message,
        showCancel: false
    })
}

/**
 * 关闭回复弹窗并刷新数据
 * @param message 弹窗内容
 * @param that 上下文
 */
function closePopupRefreshData (message,that) {
    wx.showToast({
        title: message,
        icon: 'success',
        duration: 2000
    });
    that.getData()
    that.setData({
        len: 0,
        showPopup: false
    })
}