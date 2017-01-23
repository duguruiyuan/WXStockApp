var MinuteData = require('../models/MinuteData.js')
var KLineData = require('../models/KLineData.js')
var Util = require('../../utils/util.js')


// 解析搜索数据
function parseSearchData(array) {
    var results = []

    for (var i = 0; i < array.length; i++) {
        var item = new SearchItem(array[i].secuName, array[i].secuId)
        results.push(item)
    }

    return results
}

// 解析分时数据
function parseMinutesData(data) {
    var array = data.trend_line//好股
    // var array = data.data//大咖问股
    var minutes = []

    if (array != null && array.length > 0) {
        for (var i = 0; i < array.length; i++) {
            var item = new MinuteData(array[i].time, array[i].price, array[i].ave, array[i].volume, array[i].amount)
            minutes.push(item)
        }
    }
    var result = {
        close: data.close,
        goods_id: data.goods_id,
        market_date: data.market_date,
        minutes: minutes
    }
    return result
}

// 解析分时数据
function parseMinData(data) {
    var array = data//大咖问股
    var minutes = []
    var closePrice = 10;
    if (array != null && array.length > 0) {
        var ave = 0, sumPrice = 0;
        for (var i = 0; i < array.length; i++) {
            if (i === 0) {
                closePrice = array[0].prevClosePrice
            }
            sumPrice += Number(array[i].price)
            ave = sumPrice / (i + 1)
            var item = new MinuteData(array[i].datetime.replace(':', ''), array[i].price, ave, array[i].volumn, array[i].volumnPrice)
            minutes.push(item)
        }
    }
    var result = {
        close: closePrice,
        goods_id: '600600',
        market_date: '20170113',
        minutes: minutes
    }
    return result
}

// 解析k线数据
function parseKLinesData(date) {
var array = date.reverse()
    var results = []
    var sumMa5 = 0, sumMa10 = 0, sumMa20 = 0
    for (var i = array.length - 1; i >= 0; i--) {
        if (i > 5) {
            for (var a = i; a > i-5; a--) {
                sumMa5 += Number(array[a].closePrice)
            }
            if (i > 10) {
                for (var a = i; a > i-10; a--) {
                    sumMa10 += Number(array[a].closePrice)
                }
                if (i > 20) {
                    for (var a = i; a > i-20; a--) {
                        sumMa20 += Number(array[a].closePrice)
                    }
                }
            }

        }
        var item = new KLineData(array[i].datetime, array[i].openPrice, array[i].heightPrice, array[i].lowPrice, array[i].yestodayClosePrice, sumMa5.toFixed(2) / 5, sumMa10.toFixed(2) / 10 ,sumMa20.toFixed(2)/20, array[i].volPrice/1000, array[i].closePrice, array[i].volumn)
        results.push(item)
        sumMa5 = 0, sumMa10 = 0, sumMa20 = 0
    }
    return results.reverse()
}

module.exports = {
    parseSearchData: parseSearchData,
    parseMinutesData: parseMinutesData,
    parseKLinesData: parseKLinesData,
    parseMinData: parseMinData
}
