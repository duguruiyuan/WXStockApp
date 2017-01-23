/**
 * Created cj  on 2016/1/9.
 */

/**
 * 通用工具类
 * @type {{isDate: common.isDate, isArray: common.isArray, isString: common.isString, isNull: common.isNull}}
 */

/**
 * 兼容IE8 以下版本 bind 方法不能使用的情况
 */
(function () {
    if (!Function.prototype.bind) {
        Function.prototype.bind = function (oThis) {
            if (typeof this !== 'function') {
                // closest thing possible to the ECMAScript 5
                // internal IsCallable function
                throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
            }

            var aArgs = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                fNOP = function () {
                },
                fBound = function () {
                    return fToBind.apply(this instanceof fNOP ? this : oThis,
                        aArgs.concat(Array.prototype.slice.call(arguments)));
                };

            if (this.prototype) {
                // Function.prototype doesn't have a prototype property
                fNOP.prototype = this.prototype;
            }
            fBound.prototype = new fNOP();

            return fBound;
        };
    }
}());


var common = {

    isDate: function (value) {
        return value instanceof Date;
    },
    isArray: function (value) {
        return value instanceof Array;
    },
    isString: function (value) {
        return value instanceof String;
    },
    isNull: function (value) {
        return value == null || value == undefined || value.toString().length == 0
    },
    isNotNull: function (value) {
        return !this.isNull(value)
    },
    isObject: function (value) {
        return value != null && typeof value == "object";
    },
    /**
     * 判断对象是否有某属性 如果不是对象 返回false
     * @param object
     * @param prop
     * @returns {*|boolean}
     */
    hasProperty: function (object, prop) {
        return this.isObject(object) && (object.hasOwnProperty(prop) || prop in object);
    },
    /**
     * 将数组分组
     * @param array 要分组的数组
     * @param subGroupLength 分组的长度
     */
    splitArray: function (array, subGroupLength) {
        if (!this.isArray(array)) {
            console.warn("###警告:参数array不是一个数组，分组失败");
            return array;
        }
        let index = 0;
        let newArray = [];
        while (index < array.length) {
            newArray.push(array.slice(index, index += subGroupLength));
        }
        return newArray;
    },
    /**
     * 复制属性
     * @param original 原对象
     * @param target 目标对象
     */
    copy: function (original, target = {}) {
        for (let prop in original) {
            if (typeof  original[prop] == "object") {
                target[prop] = original[prop].construct === Array ? [] : {};
                copy(original[prop], target[prop]);
            } else {
                target[prop] = original[prop];
            }
        }
        return target;
    }

}

/**
 *时间工具类
 * @type {{formatTpe: {TIME_DATE: string, MONTH_DATE: string, YEAR_DATE: string, ADJUST_DATE: string}, defaultSep: string, resolveDate: dateUtil.resolveDate, isSameDay: dateUtil.isSameDay, isSameYear: dateUtil.isSameYear, addZero: dateUtil.addZero, addZeroForArray: dateUtil.addZeroForArray, getDatePart: dateUtil.getDatePart, getTimeDate: dateUtil.getTimeDate, getMonthDate: dateUtil.getMonthDate, getYearDate: dateUtil.getYearDate, getAdjustDate: dateUtil.getAdjustDate, formatDate: dateUtil.formatDate}}
 */
var dateUtil = {
    formatType: {
        TIME_DATE: "time_date",// 只以 小时:分钟 的样式格式显示
        MONTH_DATE: "month_date", //以 月-日 小时:分钟 格式显示
        YEAR_DATE: "year_date", //以 年-月-日 小时:分钟 格式显示
        ADJUST_DATE: "adjust_date" //自适应显示 当月显示 月-日期 小时:分钟,当天显示小时:分钟,跨年显示 年-月-日 小时:分钟
    },

    defaultSep: "-",//默认时间分隔符

    /**
     * 解析时间
     * @param value 可以是字符串 或者 long 类型的
     * @returns {Date}
     */
    resolveDate: function (value) {
        console.assert(value + '****' + common.isNotNull(value), "要解析的时间为空或者不存在");
        value = value.toString().trim().replace(/-/g, "/");
        if (value.indexOf("/") == -1) {
            value = Number(value);
        }
        return new Date(value);
    },

    /**
     * 判断给定的时间和当前服务器时间是否是同一天
     * @param date 用作判断的日期对象
     * @returns {boolean} 返回boolean
     */
    isSameDay: function (date) {
        return date.toLocaleDateString() === new Date().toLocaleDateString();
    },

    /**
     * 是否同一年
     */
    isSameYear: function (date) {
        var now = new Date();
        return date.getFullYear() === now.getFullYear();
    },

    /**
     * 处理时间，不足10 的自动在前面添加0
     * @param value
     * @returns {string}
     */
    addZero: function (value) {
        return parseInt(value) >= 10 ? value : "0" + value;
    },

    /**
     *获取时间分量
     * @param date
     * @param isAddZero  位数不足10 是否在前面添加0
     * @returns {Array} 时间分量数组
     */
    getDatePart: function (date, isAddZero = true) {
        let datePart = [];
        console.assert(common.isDate(date), "error at getDatePart  method caused by date is not a instance of Date");
        datePart['year'] = date.getFullYear();
        datePart['month'] = date.getMonth() + 1;
        datePart['day'] = date.getDate();
        datePart['hours'] = date.getHours();
        datePart['minutes'] = date.getMinutes();
        datePart['seconds'] = date.getSeconds();
        if (isAddZero) {
            datePart['year'] = this.addZero(datePart['year']);
            datePart['month'] = this.addZero(datePart['month']);
            datePart['day'] = this.addZero(datePart['day']);
            datePart['hours'] = this.addZero(datePart['hours']);
            datePart['minutes'] = this.addZero(datePart['minutes']);
            datePart['seconds'] = this.addZero(datePart['seconds']);
        }
        return datePart;
    },
    /**
     * 只以 小时:分钟 的样式格式显示
     * @param datePart 时间分量
     * @returns {string} 返回格式化 小时:分钟 的字符串
     */
    getTimeDate: function (datePart) {
        return datePart['hours'] + ":" + datePart['minutes'];
    },
    /**
     * 以 月-日 小时:分钟 格式显示
     * @param datePart 时间分量
     * @param sep 月-日 之间分隔符
     * @returns {string}
     */
    getMonthDate: function (datePart, sep) {
        sep = sep || this.defaultSep;
        return datePart.month + sep + datePart.day + " " + this.getTimeDate(datePart);
    },

    /**
     * 以 年-月-日 小时:分钟 格式显示
     * @param dataPart
     * @param sep
     * @returns {string}
     */
    getYearDate: function (dataPart, sep) {
        sep = sep || this.defaultSep;
        return dataPart['year'] + sep + this.getMonthDate(dataPart, sep);
    },

    /**
     * 根据时间自适应显示的方式
     * @param value
     * @param sep
     * @returns {*}
     */
    getAdjustDate: function (value, sep, isAddZero) {
        try {
            sep = sep || this.defaultSep;
            var date = this.resolveDate(value),
                datePart = this.getDatePart(date, isAddZero);
            if (this.isSameDay(date)) {
                //同一天显示 时:分
                return this.getTimeDate(datePart);
            } else if (this.isSameYear(date)) {
                //同一年显示 月-日 时:分
                return this.getMonthDate(datePart);
            } else {
                //其他显示 年-月-日 时:分
                return this.getYearDate(datePart);
            }
        } catch (ex) {
            console.error(ex);
            return "";
        }
    },

    /**
     * 格式化日期通用入口
     * @param value 表示时间的字符串 或者Long
     * @param sep 分隔符
     * @param type 格式化类型
     * @returns {*}
     */
    formatDate: function (value, type, sep, isAddZero) {
        sep = sep || this.defaultSep;
        var date = this.resolveDate(value),
            datePart = this.getDatePart(date, isAddZero);
        switch (type) {
            case this.formatType.TIME_DATE:
                return this.getTimeDate(datePart);
                break;
            case this.formatType.MONTH_DATE:
                return this.getMonthDate(datePart, sep);
                break;
            case this.formatType.YEAR_DATE:
                return this.getYearDate(datePart, sep);
                break;
            case this.formatType.ADJUST_DATE:
                return this.getAdjustDate(value, sep);
                break;
            default:
                return this.getAdjustDate(value, sep);
        }
    },
    /**
     * 格式化对象中的日期属性
     * @param object
     * @param property 属性名
     * @param type 格式化类型 see this.formatType 对象
     * @param sep 分割符 默认-
     * @param isAddZero 不足10 是否在前面加0 可省略
     * @returns {*}
     */
    formatDateForObject: function (object, property, type, sep, isAddZero) {
        if (common.hasProperty(object, property)) {
            object[property] = this.formatDate(object[property], type, sep, isAddZero);
        }
        return object;
    },

    /**
     * 格式化对象数组中的日期属性
     * @param objects 对象数组 也可以是单个对象
     * @param property
     * @param type
     * @param sep
     * @param isAddZero
     * @returns {*}
     */
    formatDateForObjects: function (objects, property, type, sep, isAddZero) {
        if (common.isArray(objects)) {
            objects.map(function (item) {
                return this.formatDateForObject(item, property, type, sep, isAddZero);
            }.bind(this));
        } else if (common.isObject(objects)) {
            this.formatDateForObject(objects, property, type, sep, isAddZero);
        }
        return objects;
    }
}

/**
 * 文本工具类
 * @type {{trimTxt: txtUtil.trimTxt, subTxt: txtUtil.subTxt, limitLength: txtUtil.limitLength, limitSingleTxtInObject: txtUtil.limitSingleTxtInObject, limitSomeTxtInObject: txtUtil.limitSomeTxtInObject, limitTxtForObjects: txtUtil.limitTxtForObjects}}
 */
var txtUtil = {
    /**
     * 转换为string 类型 并去掉空格
     * @param txt
     */
    trimTxt: function (txt) {
        //如果是空或者对象都不进行处理
        if (!(common.isNull(txt) || common.isObject(txt))) {
            txt = txt.toString().trim();
        }
        return common.isNull(txt) ? "" : txt;
    },
    /**
     * 截取文本
     * @param txt 要截取的文本
     * @param index 其实位置
     * @param length 长度
     * @returns {string} 返回截取后的字符串
     */
    subTxt: function (txt, index, length) {
        return this.trimTxt(txt).substring(index, length);
    },

    /**
     * 限制文本长度 多余用指定的文本替换
     * @param txt 要限定的文本
     * @param length 限定长度
     * @param lastTxt 超过部分 替换的文本 默认...
     * @returns {*|string}
     */
    limitLength: function (txt, length, lastTxt) {
        if (txt.length < length) {
            return txt;
        }
        lastTxt = lastTxt ? lastTxt : "...";
        txt = this.subTxt(txt, 0, length);
        return txt.length > 0 ? txt + lastTxt : "";
    },

    /**
     * 限制某对象中单个属性的文本长度
     * @param object 操作的对象
     * @param property
     * @param length
     * @param lastTxt
     * @returns {*|string}
     */
    limitSingleTxtInObject: function (object, property, length, lastTxt) {
        if (!common.isObject(object)) {
            console.warn("the first param is not an object,so this request can't be processed !!");
        } else if (common.hasProperty(object, property)) {
            object[property] = this.limitLength(object[property], length, lastTxt);
        }
        return object;
    },
    /**
     * 限制某对象中多个属性的文本长度
     * @param object
     * @param properties 以对象的形式存在 {field:xxx,length:xxx}，也可以是此对象的数组
     * @param length
     * @param lastTxt
     */
    limitSomeTxtInObject: function (object, properties, lastTxt) {
        if (common.isArray(properties)) {
            properties.forEach(function (item) {
                if (item['field'] && item['length']) {
                    this.limitSingleTxtInObject(object, item['field'], parseInt(item['length']), lastTxt);
                }
            }.bind(this));
        } else if (common.isObject(properties)) {
            if (properties['field'] && properties['length']) {
                this.limitSingleTxtInObject(object, properties['field'], parseInt(properties['length']), lastTxt);
            }
        }
        return object;
    },

    /**
     * 限制多个对象中多个属性的文本长度
     * @param objects 可以是单个对象或者是对象的数组
     * @param properties
     * @param length
     * @param lastTxt
     */
    limitTxtForObjects: function (objects, properties, lastTxt) {
        if (common.isArray(objects)) {
            //var that = this;
            objects.map(function (object) {
                return this.limitSomeTxtInObject(object, properties, lastTxt);
            }.bind(this));
        } else if (common.isObject(objects)) {
            this.limitSomeTxtInObject(objects, properties, lastTxt);
        }
        return objects;
    }
}

function getCurrentPage() {
    let pages = getCurrentPages();
    return pages[pages.length - 1];
}

/**
 * 各种自定义弹窗
 */
//弹窗父类
let WindowHelper = {};
//展示弹窗
WindowHelper.show = function (content,icon,showOk=false,showCancel=false) {
    this.page = getCurrentPage();
    let param = {
        display: "block",
        content: content,
        icon:icon,
        showOk:showOk,
        showCancel:showCancel
    }
    this.setData(param);
}
//销毁弹窗
WindowHelper.dispose = function() {
    let display = "none", content = "",icon="";
    let param = Object.assign({}, {display, content,icon});
    this.setData(param);
}

function alert(content,icon="icon-duigouzhuanhuan",timeout=1000){
    common.copy(WindowHelper,this);
    let curpage = getCurrentPage();
    this.setData = function (param) {
       curpage.setData({"alertParam":param});
    }
    this.show(content,icon);
    setTimeout(()=>this.dispose(),timeout);
}

//关注成功
function popNoticeOk(content,timeout=1000) {
    alert.call(this,content,"icon-guanzhuchenggong",timeout);
}

//操作成功
function popSuccess(content,timeout=1000){
    alert.call(this,content,"icon-duigouzhuanhuan",timeout);
}

//操作失败
function popWrong(content,timeout=1000){
    alert.call(this,content,"icon-wrong",timeout);
}


/**
 * 确认弹窗
 */
function confirm(content, okFun) {
    common.copy(WindowHelper,this);
    let curpage = getCurrentPage();
    this.setData = function (param) {
         curpage.setData({"confirmParam":param});
    }
    this.show(content,"",true,true);
    //注册事件
    curpage.pressOk = ()=> {
        this.dispose();
        okFun();
    }
    curpage.pressCancel = ()=> this.dispose();
}

module.exports = {
    common:common
}

module.exports.common = common;
module.exports.txtUtil = txtUtil;
module.exports.dateUtil = dateUtil;
module.exports.windowHelper = {
    popNoticeOk:popNoticeOk,
    popSuccess:popSuccess,
    popWrong:popWrong,
    confirm: confirm
};

