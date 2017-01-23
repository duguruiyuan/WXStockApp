// modules/market/optional/optional.js
var httpUtil = require('../../../common/http.js').http
var _const = require('../../../common/const.js').const
var util = require('../utils/util.js')

Page({
    data: {
        plateData: [],
        typeCode: 'up',
        isRise: true,//是否按涨幅排序
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        this.getData()
    },
    getData: function () {
        httpUtil.get(_const.url.stock_plate, {typeCode: this.data.typeCode}).then(function (res) {
            if (res.data != null && res.data.length > 0) {
                for (var i = 0; i < res.data.length; i++) {
                    res.data[i].color = util.getColorByZd(res.data[i].tradeRate)
                }
                this.setData({
                    plateData: res.data
                })
            }
        }.bind(this))
    },
    sortPlate: function () {
        var typecode = this.data.typeCode
        var isrise = this.data.isRise
        if (isrise) {//如果是涨幅，那点击之后就是跌幅
            typecode = 'down'
            isrise = false
        } else {
            typecode = 'up'
            isrise = true
        }
        this.setData({
            typeCode: typecode,
            isRise:isrise
        })
        this.getData()
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

