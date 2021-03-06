var httpUtil = require('../../common/http.js').http
var _const = require('../../common/const.js').const
var util = require('/utils/util.js')
var app = getApp()
Page({
    data: {
        zhangfu: [],//涨幅
        diefu: [],///跌幅
        zhenfu: [],//振幅
        indexData:[],//指数数据
        plateData:[]//板块数据
    },
    onLoad: function (option) {
        wx.setNavigationBarTitle({
            title: '行情中心'
        })
        this.getData()
        wx.hideNavigationBarLoading()
    },
    onReady: function () {
        // 页面渲染完成
    },
    getData: function () {
        this.getIndexData()//获取指数信息
        this.getPlateData()//获取板块信息
        this.getUpDownList()//获取股票涨跌幅
    },
    getUpDownList: function () {
        var that = this
        httpUtil.get(_const.url.stock_updown, {}).then(function (res) {
            if (res.data != null){
                for (var i = 0; i < res.data.length; i++) {
                    var type = res.data[i].typeCode
                    if (type === "up") {
                        that.setData({
                            zhangfu: util.formatAryPrice(res.data[i].data)
                        })
                    } else if (type === "down") {
                        that.setData({
                            diefu: util.formatAryPrice(res.data[i].data)
                        })
                    } else if (type === "swingup") {
                        that.setData({
                            zhenfu: util.formatAryPrice(res.data[i].data)
                        })
                    }
                }
            }
        }.bind(this))
    },
    //定时获取数据
    startAutoRequest: function () {
        var that = this;
        var data = app.globalData
        var interval = data.netWorkType == 'wifi' ? data.WIFI_REFRESH_INTERVAL : data.MOBILE_REFRESH_INTERVAL;
        this.timerId = setInterval(function () {
            that.getData();
        }, interval);
    },
    getIndexData:function () {//获取指数数据
        var that = this
        httpUtil.get(_const.url.stock_index,{}).then(function(res){
            if(res.data!= null && res.data.length > 0){
                for(var i=0;i<res.data.length;i++){
                    res.data[i].color = util.getColorByZd(res.data[i].change)
                    res.data[i].price = util.formatPriceByLength(res.data[i].price,2)
                }
                that.setData({
                    indexData:res.data
                })
            }
        }.bind(this))
    },
    getPlateData:function () {//获取板块数据
        var that = this
        httpUtil.get(_const.url.stock_plate,{count:6}).then(function(res){
            if(res.data!= null && res.data.length > 0){
                for(var i=0;i<res.data.length;i++){
                    res.data[i].color = util.getColorByZd(res.data[i].tradeRate)
                }
                that.setData({
                    plateData:res.data
                })
            }
        }.bind(this))
    },
    goToOptinon:function () {
wx.navigateTo({
  url: '/modules/market/optional/optional'
})
    },
    // 停止获取数据
    stopAutoRequest: function () {
        clearInterval(this.timerId)
    },
    onShow: function () {
        // 页面显示
        this.startAutoRequest()
    },
    onHide: function () {
        // 页面隐藏
        this.stopAutoRequest()
    },
    onUnload: function () {
        // 页面关闭
        this.stopAutoRequest()
    }
})