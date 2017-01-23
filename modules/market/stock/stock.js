// modules/market/stock.js
var util = require('../utils/util.js')
var KLine = require('../kline/kline.js')
var stockData = require('../kline/stockData.js')
const app = getApp();
var httpUtil = require('../../../common/http.js')
var _const = require('../../../common/const.js').const
Page({
    data: {
        // 个股头部数据
        quotation: {},
        goodsId: 603628,
        goodsName: '清源股份',
        code: 'sh603628',
        quotationColor: '#eb333b',
        currentTimeIndex: 0,//k线导航
        currentInfoIndex: 0,
        quotePeriod: 1,//数据加载id
        quoteData: {
            canvasIndex: 0//画布id
        },
        klineTabs: ["分时", "日K", "周K", "月K"],
        klineOffset: 0,//分时K线tab 位置
        level1Tabs: ["五档", "明细"],
        level1Offset: 0,//五档明细tab 位置
        level1Index: 0,//五档明细tab显示的下标
        fiveData: {},//五档数据
        levelDetailData: [],//成交明细数据
        level1PSize: 15,//成交明细每页展示数
        level1PNo: 1,
        indexShowOrHide: true,//是否显示指数的弹出框
        indexCode: 'sh000001',//展示的指数code
        indexQuoteData: {},//指数详情
        indexTabs: ["上证指数", "深证指数", "创业板指"],
        indexTabIndex: 0,//指数tab显示的下标
        indexOffset: 0,
        isOptional:false
    },
    onLoad: function (option) {
        // 页面初始化 options为页面跳转所带来的参数
        // console.log('id****' + option.id + '***name****' + option.name + '****code****' + option.code)
        if (option.hasOwnProperty('id') || option.hasOwnProperty('name') || option.hasOwnProperty('code')) {
            this.setData({
                goodsId: parseInt(option.id),
                goodsName: option.name,
                code: option.code
            })
        }
        wx.setNavigationBarTitle({
            title: `${this.data.goodsName} (${this.data.code})`
        })
        var optional = wx.getStorageSync('optional');
        if(optional.indexOf(this.data.code) != -1){
            this.setData({
                isOptional:true
            })
        }
        initData(this)
        this.timerId = -1
        this.getData()
        // 页面初始化 options为页面跳转所带来的参数
        this.kline = new KLine()
    },
    //获取整个页面用到的数据
    getData: function () {
        this.getQuotation()///获取行情数据
        this.getQuotationLine()//获取分时K线数据
        this.getFive()//获取五档数据
        this.getLevel1()//获取成交明细
        this.getIndexQuotation()//获取底部指数行情
        this.getIndexMinData()
    },
    //获取行情基本信息的数据
    getQuotation: function () {
        var that = this
        let params = {
            code: this.data.code
        }
        httpUtil.http.get(_const.url.market_quotation, params).then(function (res) {
            if (res.data != null && res.data.length > 0) {
                that.setData({
                    quotation: {
                        price: util.formatPriceByLength(res.data[0].price, 2),//现价
                        change: res.data[0].change,//变动
                        changePct: res.data[0].changePct,//变动率
                        limitUp: util.getLimitUpOrDown(res.data[0].closePrice,'up',res.data[0].price),
                        limitDown: util.getLimitUpOrDown(res.data[0].closePrice,'down',res.data[0].price),
                        open: util.formatPriceByLength(res.data[0].openPrice, 2),//开盘价
                        high: util.formatPriceByLength(res.data[0].highPrice, 2),//最高价
                        low: util.formatPriceByLength(res.data[0].lowPrice, 2),//最低价
                        turnoverRate: util.formatHsl(res.data[0].turnoverRate * 100),//换手率
                        closePrice: util.formatPriceByLength(res.data[0].closePrice, 2),
                        swing: res.data[0].swing,
                        volumn: util.formatVolumn(res.data[0].volumn / 100),//成交量
                        totalValue: util.formatAmount(res.data[0].totalValue),//总股本
                        volumnPrice: util.formatAmount(res.data[0].volumnPrice),//成交额
                        circulationValue: util.formatAmount(res.data[0].circulationValue),//流通市值
                        date: 0,
                        time: 0,
                        color: util.getColorByZd(res.data[0].change),
                        goodsId: res.data[0].id
                    }
                })
                wx.hideNavigationBarLoading()
            }

        }.bind(this))
    },
    //获取分时K线的数据
    getQuotationLine: function (callback) {
        if (this.data.quotePeriod == 1) {
            // 获取分时走势
            this.getMinData(callback)
        } else {
            // 获取K线走势
            this.getKlineData(callback)
        }
    },
    ///获取分时的数据
    getMinData: function (callback) {
        // wx.showNavigationBarLoading()
        var that = this

        stockData.getMinutes({
            code: util.trim(that.data.code),
            id: that.data.goodsId
        }).then(function (results) {
            if (callback != null && typeof (callback) == 'function') {
                callback()
            }
            that.kline.drawMiniteCanvas(results, getCanvasId(that.data.quotePeriod))
        }, function (res) {
            console.log("------fail----", res)
        })
    },
    //获取K线的数据
    getKlineData: function (callback) {
        var that = this

        stockData.getKLines({
            code: util.trim(that.data.code),
            period: that.data.currentTimeIndex,
            ma: 7
        }).then(function (results) {
            if (callback != null && typeof (callback) == 'function') {
                callback()
            }
            that.kline.drawKLineCanvas(results, getCanvasId(that.data.quotePeriod), that.data.quotePeriod)
        }, function (res) {
            console.log("------fail----", res)
        })
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
    //获取五档数据
    getFive: function () {
        var that = this
        let params = {
            code: this.data.code
        }
        httpUtil.http.get(_const.url.stock_five, params).then(function (res) {
            if (res.data != null && res.data.length > 0) {
                that.setData({
                    fiveData: {
                        buy_1: util.formatPriceByLength(res.data[0].buy_1,2),
                        buy_2: util.formatPriceByLength(res.data[0].buy_2,2),
                        buy_3: util.formatPriceByLength(res.data[0].buy_3,2),
                        buy_4: util.formatPriceByLength(res.data[0].buy_4,2),
                        buy_5: util.formatPriceByLength(res.data[0].buy_5,2),
                        buy_1_s: util.formatPriceByLength(res.data[0].buy_1_s / 100,0),
                        buy_2_s: util.formatPriceByLength(res.data[0].buy_2_s / 100,0),
                        buy_3_s: util.formatPriceByLength(res.data[0].buy_3_s / 100,0),
                        buy_4_s: util.formatPriceByLength(res.data[0].buy_4_s / 100,0),
                        buy_5_s: util.formatPriceByLength(res.data[0].buy_5_s / 100,0),
                        sell_1: util.formatPriceByLength(res.data[0].sell_1,2),
                        sell_2: util.formatPriceByLength(res.data[0].sell_2,2),
                        sell_3: util.formatPriceByLength(res.data[0].sell_3,2),
                        sell_4: util.formatPriceByLength(res.data[0].sell_4,2),
                        sell_5: util.formatPriceByLength(res.data[0].sell_5,2),
                        sell_1_s: util.formatPriceByLength(res.data[0].sell_1_s / 100,0),
                        sell_2_s: util.formatPriceByLength(res.data[0].sell_2_s / 100,0),
                        sell_3_s: util.formatPriceByLength(res.data[0].sell_3_s / 100,0),
                        sell_4_s: util.formatPriceByLength(res.data[0].sell_4_s / 100,0),
                        sell_5_s: util.formatPriceByLength(res.data[0].sell_5_s / 100,0)
                    }
                })
            }
        }.bind(this))
    },
    //获取成交明细数据
    getLevel1: function () {
        var that = this
        let params = {
            code: this.data.code,
            start: this.data.level1PNo,
            count: this.data.level1PSize
        }

        httpUtil.http.get(_const.url.stock_level1detail, params).then(function (res) {
            if (res.data != null && res.data.length > 0) {
                that.setData({
                    levelDetailData: that.data.levelDetailData.concat(res.data)
                })
            }
        }.bind(this))
    },
    // 停止获取数据
    stopAutoRequest: function () {
        clearInterval(this.timerId)
    },
    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {
        // 页面显示
        this.startAutoRequest()
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
        this.stopAutoRequest()
    },onShareAppMessage: function () {
        return {
            title: this.data.goodsName+'('+this.data.code+')',
            desc: '最新价:'+ this.data.quotation.price +'涨跌幅:' + this.data.quotation.changePct,
            path: 'modules/market/stock/stock?id='+this.data.goodsId+'&name='+this.data.goodsName+'&code='+this.data.code
        }
    },
    //分时日K月K周K的切换
    klineTabClick: function (e) {
        let index = e.currentTarget.id
        let period = 1
        var canvasIndex = 0
        switch (index) {
            case "0":
                period = 1;
                canvasIndex = 0
                break;
            case "1":
                period = 100;
                canvasIndex = 1
                break;
            case "2":
                period = 101;
                canvasIndex = 2
                break;
            case "3":
                period = 102;
                canvasIndex = 3
                break;
        }

        this.setData({
            currentTimeIndex: index,
            quotePeriod: period,
            quoteData: {
                canvasIndex: canvasIndex
            },
            klineOffset: e.currentTarget.offsetLeft
        });

        if (this.kline.isCanvasDrawn(canvasIndex + 1)) return;

        this.getQuotationLine(function () {
            wx.hideNavigationBarLoading()
        })
    },
    //五档和明细的切换
    level1TabClick: function (e) {
        let index = e.currentTarget.id
        var level1Index = 0;
        switch (index) {
            case "level10":
                level1Index = 0;
                break;
            case "level11":
                level1Index = 1;
                break;
        }
        this.setData({
            level1Offset: e.currentTarget.offsetLeft,
            level1Index: level1Index
        });
    },
    //成交明细滚动
    level1Scroll: function (e) {
        this.setData({
            level1PSize: 10,
            level1PNo: this.data.level1PNo + 1
        })
        this.getLevel1()
    },
    //是否显示指数信息
    isShowStockIndex: function () {
        var isShow = true
        if (this.data.indexShowOrHide) {
            isShow = false
        } else {
            isShow = true
        }
        this.setData({
            indexShowOrHide: isShow
        })
    },
    //获取底部展示的指数详情
    getIndexQuotation: function () {
        var that = this
        let params = {
            code: this.data.indexCode
        }
        httpUtil.http.get(_const.url.market_quotation, params).then(function (res) {
            if (res.data != null && res.data.length > 0) {
                that.setData({
                    indexQuoteData: {
                        price: util.formatPriceByLength(res.data[0].price, 2),
                        color: util.getColorByZd(res.data[0].change),
                        name: res.data[0].name,
                        changePct: res.data[0].changePct,
                        change: res.data[0].change,
                        highPrice: util.formatPriceByLength(res.data[0].highPrice, 2),
                        highPrice_color: util.getColorByClosePrice(res.data[0].highPrice,res.data[0].closePrice),
                        lowPrice: util.formatPriceByLength(res.data[0].lowPrice, 2),
                        lowPrice_color: util.getColorByClosePrice(res.data[0].lowPrice, res.data[0].closePrice),
                        openPrice: util.formatPriceByLength(res.data[0].openPrice, 2),
                        openPrice_color: util.getColorByClosePrice(res.data[0].openPrice, res.data[0].closePrice),
                        closePrice: util.formatPriceByLength(res.data[0].closePrice, 2)
                    }
                })
            }

            // indexQuoteData
        }.bind(this))
    },
    //获取指数分时
    getIndexMinData:function (callback) {
        var that = this
        stockData.getMinutes({
            code: util.trim(that.data.indexCode),
            id: that.data.goodsId
        }).then(function (results) {
            if (callback != null && typeof (callback) == 'function') {
                callback()
            }
            that.kline.drawMiniteCanvas(results, 'indexMin'+that.data.indexTabIndex)
        }, function (res) {
            console.log("------fail----", res)
        })
    },
    //添加自选股
    addOptional:function () {
        console.log('addOptional'+this.data.code)
        stockData.addOptional(this.data.code)
        this.setData({
            isOptional:true
        })
    },
    removeOptional:function () {
            console.log('removeOptional'+this.data.code)
        stockData.updateOptional(this.data.code)
        this.setData({
            isOptional:false
        })
    },
    //股票详情页指数点击事件
    indexTabClick: function (e) {
        let index = e.currentTarget.id
        var indexIndex = 0;
        var code = 'sh000001'
        switch (index) {
            case "index0":
                indexIndex = 0;
                code = 'sh000001'
                break;
            case "index1":
                indexIndex = 1;
                code = 'sz399106'
                break;
            case "index2":
                indexIndex = 2;
                code = 'sz399102'
                break;
        }
        this.setData({
            indexOffset: e.currentTarget.offsetLeft,
            indexTabIndex: indexIndex,
            indexCode:code
        });
        wx.setStorage({
            key:"indexCode",
            data:code
        })
        wx.setStorage({
            key:"indexTabIndex",
            data:indexIndex
        })
        wx.setStorage({
            key:"indexOffset",
            data:e.currentTarget.offsetLeft
        })
        this.getIndexQuotation()
        this.getIndexMinData()
    }
})

function initData(that) {
    var indexCode = wx.getStorageSync('indexCode')
    if(indexCode == null || indexCode == '' ){
        indexCode='sh000001'
    }

    var indexTabIndex = wx.getStorageSync('indexTabIndex')
    if(indexTabIndex == null || indexTabIndex == '' ){
        indexTabIndex = 0
    }
    var indexOffset = wx.getStorageSync('indexOffset')
    if(indexOffset == null || indexOffset == '' ){
        indexOffset = 0
    }

    // 初始化数据显示
    var quota = {
        price: '--',
        change: '--',
        changePct: '--',
        open: '--',
        high: '--',
        low: '--',
        turnoverRate: '--',
        closePrice: '--',
        swing: '--',
        volumn: '--',
        totalValue: '--',
        volumnPrice: '--',
        circulationValue: '--',
        date: 0,
        time: 0,
        color: 'colgray',
        goodsId: 0
    }

    var fiveData = {
        buy_1: '--',
        buy_2: '--',
        buy_3: '--',
        buy_4: '--',
        buy_5: '--',
        buy_1_s: '--',
        buy_2_s: '--',
        buy_3_s: '--',
        buy_4_s: '--',
        buy_5_s: '--',
        sell_1: '--',
        sell_2: '--',
        sell_3: '--',
        sell_4: '--',
        sell_5: '--',
        sell_1_s: '--',
        sell_2_s: '--',
        sell_3_s: '--',
        sell_4_s: '--',
        sell_5_s: '--'
    }

    var indexQuote = {
        price: '--',
        color: 'colgray',
        name: '--',
        changePct: '--',
        change: '--',
        highPrice: '--',
        highPrice_color: 'colgray',
        lowPrice: '--',
        lowPrice_color: 'colgray',
        openPrice: '--',
        openPrice_color: 'colgray',
        closePrice: '--'
    }

    that.setData({
        quotation: quota,
        fiveData:fiveData,
        indexQuoteData:indexQuote,
        indexCode:indexCode,
        indexTabIndex:indexTabIndex,
        indexOffset:indexOffset
    })
}

function getCanvasId(period) {
    switch (period) {
        case 1:
            return 1;
            break;
        case 100:
            return 2;
            break;
        case 101:
            return 3;
            break;
        case 102:
            return 4;
            break;
    }
    return 1;
}