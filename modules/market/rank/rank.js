var httpUtil = require('../../../common/http.js').http
var _const = require('../../../common/const.js').const
var util = require('../utils/util.js')

Page({
    data: {
        stocksData: [],
        title: '涨幅榜',
        typeCode: 'up',
        isRise: true,//是否按涨幅排序
        isPlate: false,//是否板块个股
        typeId: 0,

    },
    onLoad: function (option) {
        // 页面初始化 options为页面跳转所带来的参数
        if (option.hasOwnProperty('isPlate') || option.hasOwnProperty('typeCode') || option.hasOwnProperty('title') || option.hasOwnProperty('typeId')) {
            console.log(option.typeId)
            this.setData({
                isPlate: option.isPlate,
                typeCode: option.typeCode,
                title: option.title,
                typeId: option.typeId
            })
        }
        wx.setNavigationBarTitle({
            title: this.data.title
        })

        this.getData()
    },
    getData: function () {
        var that = this
        var url = _const.url.stock_rank
        var params = {
            typeCode: this.data.typeCode,
            count: 100
        }

        if (1 == this.data.isPlate) {
            url = _const.url.stock_plate_trade
            params = {
                typeCode: this.data.typeCode,
                typeId: this.data.typeId,
                start: 1,
                count: 15
            }
        }
        wx.request({
            url: url,
            data: params,
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function (res) {
                console.log(res)
                var result = []
                if (1 == that.data.isPlate) {
                    var data = res.data.data
                    for (var i = 0; i < data.length; i++) {
                        result.push({
                            code: data[i].code,
                            price: data[i].price,
                            changePct: data[i].changeRate + '%',
                            codeName: data[i].name
                        })
                    }
                } else {
                    var data = res.data.replace(/ /g, ",")
                    var daraAry = data.split('\n')

                    var stocks = wx.getStorageSync('stock')


                    for (var i = 0; i < daraAry.length; i++) {
                        var obj = daraAry[i].split(",")
                        var code = obj[0], price = obj[1], changePct = obj[2]
                        if (code != null && price != null && changePct != null &&
                            code != '' && price != '' && changePct != '' &&
                            code != undefined && price != undefined && changePct != undefined) {
                            result.push({
                                code: code,
                                price: price,
                                changePct: changePct,
                                codeName: stocks[code].codeName
                            })
                        }
                    }

                }
                that.setData({
                    stocksData: result
                })
            },
            fail: function () {
                console.log('fail****')
            },
            complete: function () {
                console.log('complete****')
            }
        })
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

