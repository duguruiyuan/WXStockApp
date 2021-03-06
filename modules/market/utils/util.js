// 数字格式化
function formateNumber(num, length) {
    return ('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
}

// 时间格式化 formate：格式，如yyyy-MM-dd HH:mm:ss.hhh
function formateTime(date, formate) {
    var result = formate

    result = result.replace("yyyy", date.getFullYear())
    result = result.replace("yy", formateNumber(date.getYear(), 2))
    result = result.replace("MM", formateNumber(date.getMonth() + 1, 2))
    result = result.replace("dd", formateNumber(date.getDate(), 2))
    result = result.replace("HH", formateNumber(date.getHours(), 2))
    result = result.replace("mm", formateNumber(date.getMinutes(), 2))
    result = result.replace("ss", formateNumber(date.getSeconds(), 2))
    result = result.replace("hhh", formateNumber(date.getMilliseconds(), 3))

    return result;
}

// 转换时间显示格式  20140601 --> 2014-06-01
function formatDateYYYYmmdd(originDate, seperator) {
    var result = ''

    var tSeperator = '-'
    if (seperator != null && seperator != '') {
        tSeperator = seperator
    }

    originDate = originDate + ''
    var length = originDate.length
    if (length >= 8) {
        var year = originDate.substr(0, 4)
        var month = originDate.substr(4, 2)
        var day = originDate.substr(6, 2)
        result = year + tSeperator + month + tSeperator + day
    }

    return result
}

// 1507111022 15年07月11日11时22分 -> 15/07/11/10:22
function formatDateY_M_D_HHmm(orgDate, separator) {
    var fixDate = '';
    var t_separator = '/';
    if (separator != null && separator != '') {
        t_separator = separator;
    }

    var nlen = orgDate.length;
    if (nlen >= 10) {
        var tYear = orgDate.substring(0, 2);
        var tMonth = orgDate.substring(2, 4);
        // if (tMonth.substr(0, 1) == '0') {
        //     tMonth = tMonth.substr(1, 1);
        // }

        var tDay = orgDate.substring(4, 6);
        // if (tDay.startsWith("0")) {
        //     tDay = tDay.replace("0", "");
        // }

        var tHour = orgDate.substring(6, 8);

        var tMinute = orgDate.substring(8, 10);

        fixDate = tYear + t_separator + tMonth + t_separator + tDay + t_separator + tHour + ":" + tMinute;
    }
    return fixDate;
}

/**
 * 保留两位小数
 */
function formatAryPrice(ary) {
    if(ary != null && ary.length > 0){
        for (var i = 0;i < ary.length;i++){
            ary[i].price = Number(ary[i].price).toFixed(2)
        }
    }
    return ary
}

/**
 * 保留两位小数
 */
function formatZd(value) {
    value = Number(value)
    if (!value) {
        return '--'
    }

    return value.toFixed(2)
}

function formatZdf(value) {
    value = Number(value)
    if (!value) {
        return '--'
    }

    return value.toFixed(2) + '%'
}

// 格式化换手率
function formatHsl(value) {
    value = Number(value)
    if (value === "0") {
        return '--'
    }
    return value.toFixed(2) + '%'
}

// 格式化市盈率、市净率、量比
function formatSyl(value) {
    value = Number(value) / 100
    if (value == 0) {
        return '--'
    } else {
        return value.toFixed(2)
    }
}

// 格式化成交量
function formatVolumn(val) {
    val = Number(val)
    if (val < 100000) {
        return val.toFixed(2)
    } else if (val >= 100000 && val < 1000000) {
        val = val / 10000;
        return val.toFixed(2) + '万'
    } else if (val >= 1000000 && val < 10000000) {
        val = val / 10000;
        return val.toFixed(2) + '万'
    } else if (val >= 10000000 && val < 100000000) {
        val = val / 10000;
        return val.toFixed(2) + '万'
    } else {
        val = val / 100000000;
        return val.toFixed(2) + '亿'
    }
}

// 格式化净流
function formatJl(val) {
    val = Number(val)
    var flag = ''
    if (val < 0) {
        flag = '-'
        val = -val
    }

    if (val < 10000) {
        return flag + val
    } else if (val < 100000000) {
        val = val / 10000;
        return flag + val.toFixed(2) + '万'
    } else if (val < 100000000000) {
        val = val / 100000000
        return flag + val.toFixed(2) + '亿'
    } else {
        val = val / 100000000
        return flag + val.toFixed(2) + '亿'
    }
}

// 格式化总值
function formatAmount(val) {
    val = Number(val)
    var flag = ''
    if (val < 0) {
        flag = '-'
        val = -val
    } else if (Number(val) === 0) {
        return '--';
    }

    if (val < 100000) {
        return flag + val.toFixed(2)
    } else if (val >= 100000 && val < 1000000) {
        val = val / 10000;
        return flag + val.toFixed(2) + '万';
    } else if (val >= 1000000 && val < 10000000) {
        val = val / 10000;
        return flag + val.toFixed(2) + '万';
    } else if (val >= 10000000 && val < 100000000) {
        val = val / 10000;
        return flag + val.toFixed(2) + '万';
    } else if (val >= 100000000 && val < 1000000000) {
        val = val / 100000000;
        return flag + val.toFixed(2) + '亿';
    } else if (val >= 1000000000 && val < 10000000000) {
        val = val / 100000000;
        return flag + val.toFixed(2) + '亿';
    } else {
        val = val / 100000000;
        return flag + val.toFixed(2) + '亿';
    }
}

/**
 * 根据涨跌获取颜色
 * @param zd 涨跌幅
 * @returns {*}
 */
function getColorByZd(zd) {
    if(zd.indexOf("%") != -1){
        zd = zd.substring(0,zd.length -1)
    }
    zd = Number(zd)
    if (zd >= 0) {
        return 'colred';
    } else if (zd == 0) {
        return 'colgray';
    } else {
        return 'colgreen';
    }
}

/**
 * 根据价格获取颜色的css
 * @param price
 * @param closePrice
 * @returns {*}
 */
function getColorByClosePrice(price, closePrice) {
    if (Number(price) == Number(closePrice)) {//灰色
        return 'colgray';
    } else if (Number(price) > Number(closePrice)) {//红色
        return 'colred';
    } else {//绿色
        return 'colgreen';
    }
}

/**
 * 保留price的len位数
 * @param value 需要格式化的值
 * @param len 长度
 * @returns {*}
 */
function formatPriceByLength(value, len) {
    value = Number(value)
    if (!value) {
        return '--'
    }

    return value.toFixed(len)
}

/**
 * 根据昨收计算涨停跌停
 * @param closePrice 昨收
 * @param type up涨停,down 跌停
 * @param price 现价
 */
function getLimitUpOrDown(closePrice,type,price) {
    if (type == 'up') {
        if (Number(price) > Number(closePrice)) {
            return Number(price).toFixed(2)
        }
        return (closePrice * 1.1).toFixed(2)
    } else if (type == 'down') {
        return (closePrice * 0.9).toFixed(2)
    } else {
        return closePrice
    }
}
//.----> +
//?----> *
//&----> @
//=----> $
function urlNavigateEncode(url) {
    var str = url.replace(/\./g, "+")
    str = str.replace(/\?/g, "*")
    str = str.replace(/\&/g, "@")
    str = str.replace(/=/g, "$")
    return str
}

function urlNavigateDecode(str) {
    var url = str.replace(/\+/g, ".")
    url = url.replace(/\*/g, "?")
    url = url.replace(/\@/g, "&")
    url = url.replace(/\$/g, "=")
    return url
}

// //格式化看盘的时间,当天的：2014-01-01 11:11:11 -->11:11，不是当天：2014-01-01 11:11:11 -->01-01
// function formatKanPanTime(date) {
//     if (!date) {
//         return ''
//     }

//     var len = date.length
//     if (len >= 10) {
//         var orgDate = date.substr(0, 10)
//         var serverDate = getApp().globalData.currSystemDate
//         if (!serverDate || serverDate.length <= 0) {
//             //设置当前客户端时间
//             serverDate = formateTime(new Date(), "yyyy-MM-dd")
//             getApp().globalData.currSystemDate=serverDate;
//         }

//         if (orgDate == getApp().globalData.currSystemDate) {
//             return formatDateHHMM(date)
//         } else {
//             return date.substr(5, 5)
//         }
//     } else {
//         return date
//     }
// }

// // 转换时间显示格式  2014-01-01 11:11:11 --> 11:11
// function formatDateHHMM(originDate) {
//     if (!originDate) {
//         return ''
//     }

//     var length = originDate.length
//     if (length >= 19) {
//         return originDate.substr(11, 5)
//     } else {
//         return originDate
//     }
// }

//格式化股票代码
function formatCode(goodsId) {
    if (isBK(goodsId)) {
        return formatBKGoodCode(goodsId);
    } else {
        return getStockCodeByGoodsId(goodsId);
    }
}

function formatBKGoodCode(bkGoodid) {
    var sBKCode = '';
    if (isBK(bkGoodid)) {
        sBKCode = "BK" + (bkGoodid % 10000);
    }
    return sBKCode;
}

// 版块
function isBK(dwGoodsID) {
    dwGoodsID = parseInt(dwGoodsID)
    var num = parseInt((dwGoodsID / 1000).toFixed(0))
    return (num >= 2001 && num <= 2003);
}

// 国内版块
function isGNBK(goodsId) {
    goodsId = parseInt(goodsId)
    return parseInt((goodsId / 1000).toFixed(0)) == 2001
}

// 行业版块
function isHYBK(goodsId) {
    goodsId = parseInt(goodsId)
    return parseInt((goodsId / 1000).toFixed(0)) == 2002
}

// 地区版块
function isDQBK(goodsId) {
    goodsId = parseInt(goodsId)
    return parseInt((goodsId / 1000).toFixed(0)) == 2003
}

// 指数
function isZS(goodsId) {
    goodsId = parseInt(goodsId)


    return ((goodsId > 0 && goodsId < 9000)
    || Math.floor(goodsId / 100000) == 8
    || Math.floor(goodsId / 10000) == 139
    || goodsId == 5500001);


}
//沪市
function isHS(code) {
    if (code === null || code === "" || code === undefined) {
        return false;
    }
    if (code.length > 2) {
        var head = code.substring(0, 2);
        if (head === 'sh') {
            return true;
        } else {
            return false;
        }
    }
    return false;
}
//深市
function isSS(code) {
    if (code === null || code === "" || code === undefined) {
        return false;
    }

    if (code.length > 2) {
        var head = code.substring(0, 2);
        if (head === 'sz') {
            return true;
        } else {
            return false;
        }
    }
    return false;
}

// A股
function isAG(goodsId) {
    goodsId = parseInt(goodsId)
    return ((goodsId >= 600000 && goodsId < 699999)
    || (goodsId > 1000000 && goodsId < 1999999 && (parseInt((goodsId / 10000).toFixed(0)) == 100 || parseInt((goodsId / 10000).toFixed(0)) == 130)));
}

// 获取版块类型
function getCurrentGoodsClassType(goodsId) {
    var type = 3;

    if (isGNBK(goodsId)) {
        type = 0;
    } else if (isHYBK(goodsId)) {
        type = 1;
    } else if (isDQBK(goodsId)) {
        type = 2;
    } else if (isZS(goodsId)) {
        type = 3;
    }

    return type;
}

// 仅个股 不包含版块返回 bk20XXXX
function getStockCodeByGoodsId(goodsId) {
    goodsId = '' + goodsId;
    if (goodsId.length == 6) {
        return goodsId;
    } else if (goodsId.length < 6) {
        var left = 6 - goodsId.length;
        var stockCode = goodsId;
        for (var i = 0; i < left; i++) {
            stockCode = "0" + stockCode;
        }
        return stockCode;
    } else {
        var left = goodsId.length - 6;
        return goodsId.substring(left);
    }
}

function trim(str) { //删除左右两端的空格
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

module.exports = {
    formateTime: formateTime,
    formateNumber: formateNumber,
    formatDateYYYYmmdd: formatDateYYYYmmdd,
    formatAryPrice: formatAryPrice,
    formatZd: formatZd,
    formatZdf: formatZdf,
    getColorByZd: getColorByZd,
    formatHsl: formatHsl,
    formatSyl: formatSyl,
    formatVolumn: formatVolumn,
    formatJl: formatJl,
    formatAmount: formatAmount,
    urlNavigateEncode: urlNavigateEncode,
    urlNavigateDecode: urlNavigateDecode,
    formatCode: formatCode,
    isBK: isBK,
    isZS: isZS,
    isHS: isHS,
    isSS: isSS,
    getColorByClosePrice: getColorByClosePrice,
    getLimitUpOrDown: getLimitUpOrDown,
    formatPriceByLength: formatPriceByLength,
    getCurrentGoodsClassType: getCurrentGoodsClassType,
    formatDateY_M_D_HHmm: formatDateY_M_D_HHmm,
    trim: trim
}
