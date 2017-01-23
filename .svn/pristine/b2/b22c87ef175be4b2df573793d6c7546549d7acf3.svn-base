import Promise from "../../../resources/lib/promise.min"
var errorInfo = '数据获取失败'
var parser = require('./parsers/stock-parser.js')
var Util = require('../utils/util.js')
const app = getApp();
var httpUtil = require('../../../common/http.js').http
var _const = require('../../../common/const.js').const

// 搜索股票
function search({key = ""} = {}) {

    let params = {
        key: key
    }
    var promise = httpUtil.get(_const.url.stock_search, params).then(function (res) {
        // console.log("min*******" + res.data)
        if (res.data.length > 0) {
            return res.data
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
        if (res.data != null && res.data.length > 0) {
            var result = parser.parseMinData(res.data)
            return result
        } else if(res.success == true){
            var result = {
                close: 0,
                goods_id: id,
                market_date: '20170113',
                minutes: ["09:30".replace(':', ''), 0, 0, 0, 0]
            }
            return Promise.resolve(result)
        }else {
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

/**
 * 添加自选股
 * @param code
 */
function addOptional(code) {
    var options = wx.getStorageSync('optional');
    if (options != null && options != '') {
        if(options.indexOf(code) == -1){
            options.push(code)
        }
    } else {
        options = [code]
    }
    wx.setStorage({
        key: "optional",
        data: options
    });
}

/**
 * 添加自选股
 * @param code
 */
function updateOptional(code) {
    var options = wx.getStorageSync('optional');
    if (options != null && options != '') {
        if(options.indexOf(code) != -1){
            options.splice(options.indexOf(code),1)
        }
    }
    wx.setStorage({
        key: "optional",
        data: options
    });
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

function getAllStocks(){

wx.request({
  url: _const.url.stocks,
  data: {},
  method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
  success: function(res){
      var data = res.data.replace(/ /g,",").split('\n')
      var result = {}
      for(var i=0;i<data.length;i++){
          var obj = data[i].split(",")
          var codeName= obj[0],code = obj[1]
          if(codeName != null && code != null &&
              codeName != '' && code != ''  &&
              codeName != undefined && code != undefined ){
              result[code] =  {code:code,codeName:codeName}
          }
      }
      wx.setStorage({
          key:'stock',
          data:result
      })
  },
  fail: function() {
      console.log('getAllStocks******fail')
  },
  complete: function() {

  }
})
}

module.exports = {
    search: search,
    getKLines: getKLines,
    getMinutes: getMinutes,
    requestOptionals: requestOptionals,
    addOptional: addOptional,
    updateOptional: updateOptional,
    getAllStocks:getAllStocks,
    commitOptionals: commitOptionals
}
