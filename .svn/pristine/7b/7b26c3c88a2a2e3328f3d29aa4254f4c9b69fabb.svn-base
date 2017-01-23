import Promise from "../../../resources/lib/promise.min"
var errorInfo = '数据获取失败'
var parser = require('./parsers/stock-parser.js')
var Util = require('../utils/util.js')
const app = getApp();
var httpUtil = require('../../../common/http.js').http
var _const = require('../../../common/const.js').const

var mainStockIndex = [1, 1399001, 300, 1399005, 1399006, 1399106, 2, 3, 1399003, 9, 10, 16, 1399004]

// 搜索股票
function search({key = ""} = {}) {

    let params = {
        code: code,
        id: id
    }
    var promise = httpUtil.get(_const.url.min_quotation, params).then(function (res) {
        // console.log("min*******" + res.data)
        if (res.data.length > 0) {
            var result = parser.parseMinData(res.data)
            return result
        } else {
            return Promise.reject(errorInfo)
        }
    }.bind(this))

    return promise;
}

/**
 * 获取分时
 * code：股票code
 * id:股票ID
 */
function getMinutes({code, id} = {}) {
    let params = {
        code: code,
        id: id
    }
    var promise = httpUtil.get(_const.url.min_quotation, params).then(function (res) {
        // console.log("min*******" + res.data)
        if (res.data.length > 0) {
            var result = parser.parseMinData(res.data)
            return result
        } else {
            return Promise.reject(errorInfo)
        }
    }.bind(this))

    return promise;
}

/**
 * 获取K线信息
 *
 * code:股票ID
 * period:周期 日K线1、周K线2、月K线3
 * ma:1：5日，2：10日，4：20日，7：5、10、20日都包含
 */
function getKLines({code, period, ma = 7} = {}) {
    let params = {
        code: code,
    }
    var klineUrl = _const.url.day_quotation;
    if (period == 1) {
        klineUrl = _const.url.day_quotation;
    } else if (period == 2) {
        klineUrl = _const.url.week_quotation;
    } else if (period == 3) {
        klineUrl = _const.url.month_quotation;
    }
    var promise = httpUtil.get(klineUrl, params).then(function (res) {
        if (res.data.length > 0) {
            var result = parser.parseKLinesData(res.data)
            return result
        } else {
            var nodata = {
                "code": code,
                "closePrice": 0,
                "openPrice": 0,
                "heightPrice": 0,
                "lowPrice": 0,
                "volumn": 0,
                "volPrice": 0,
                "datetime": 0,
                "yestodayClosePrice": 0,
                "chgPct": 0
            }
            return Promise.resolve(nodata)
        }
    }.bind(this))
    return promise;
}

// 获取自选股
function requestOptionals() {
    let params = {
        code: code,
        id: id
    }
    var promise = httpUtil.get(_const.url.min_quotation, params).then(function (res) {
        // console.log("min*******" + res.data)
        if (res.data.length > 0) {
            var result = parser.parseMinData(res.data)
            return result
        } else {
            return Promise.reject(errorInfo)
        }
    }.bind(this))

    return promise;
}

// 更新自选股
function commitOptionals({goodsId} = {}) {
    let params = {
        code: code,
        id: id
    }
    var promise = httpUtil.get(_const.url.min_quotation, params).then(function (res) {
        // console.log("min*******" + res.data)
        if (res.data.length > 0) {
            var result = parser.parseMinData(res.data)
            return result
        } else {
            return Promise.reject(errorInfo)
        }
    }.bind(this))

    return promise;
}

module.exports = {
    search: search,
    getKLines: getKLines,
    getMinutes: getMinutes,
    requestOptionals: requestOptionals,
    commitOptionals: commitOptionals
}
