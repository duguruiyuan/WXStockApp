/**
 * Created by cj on 2017/1/10.
 * http 服务类
 */
/**
 * 请求方式
 * @type {{GET: string, POST: string}}
 */
import Promise from "../resources/lib/promise.min"
const _const = require("const.js").const;
const urls = _const.url;
const LoginHepler = require("login.js").loginHelper;
const {windowHelper} = require("utils.js");
//-----需要登录时返回状态码---------
const NEED_LOGIN_CODE = 100;
//重试次数，大于一次，则直接弹框提示
let RECONNECT_TIMES = 0;
//------保存当前请求的参数，主要用于session失效后发起请求---------
let CURRENT_REQEST_PARAM = {};

//---------请求方式常量，可添加get，post,put,delete----------
const REQ_METHOD = {
    GET: 'GET',
    POST: 'POST',
}
let http = {};

//---------get请求-----------
http.get = (url, data = {}, header = {'content-type': 'application/json'}) => {
    return http_request(url, REQ_METHOD.GET, data, header)
}

//----------post请求---------
http.post = (url, data = {}, header = {'content-type': 'application/x-www-form-urlencoded'}) => {
    return http_request(url, REQ_METHOD.POST, data, header)
}

//----------请求方法，调用wx.request-------
function http_request(url,
                      method = REQ_METHOD.GET,
                      data = {},
                      header = {'content-type': 'application/json'}) {
    pre_req(url, method, data, header);
    return new Promise((resolve, reject) => {
        wx.request({
            url: url,
            data: data,
            header: header,
            method: method,
            success: res => post_req(res, resolve, reject),
            fail: res => reject(res)
        })
    });
}

//------------请求之前----------
function pre_req(url, method, data, header) {
    //加载loading
    wx.showNavigationBarLoading();
    //========如果不是登录，则保存当前请求的参数========
    if (url !== urls.login) {
        CURRENT_REQEST_PARAM = {url: url, method: method, data: data, header: header}
    }
    let expires = wx.getStorageSync(_const.sessionExpiresKey);
    //session 没有过期,携带sesionid
    if (parseInt(expires) > Date.now()) {
        header.Cookie = "JSESSIONID=" + wx.getStorageSync(_const.SessionKey);
    }
}

//--------请求之后----------
function post_req(res, resolve, reject) {
    //隐藏loading
    wx.hideNavigationBarLoading();
    // 此处有个bug,因为404也会调用success方法,所以需要判断是否成功
    console.log(res)
    if (res.statusCode < 400) {
        let result = res.data;
        //-----如果errcode存在,并且errcode=0，status=1则执行resolve，否则执行reject
        if ("errcode" in result) {
            //请求成功，更新session过期时间,过期时间12小时
            wx.setStorageSync(_const.sessionExpiresKey, Date.now() + 12 * 60 * 60 * 1000);
            let errCode = +result.errcode;
            //------需要登录-------
            if (errCode == NEED_LOGIN_CODE) {
                RECONNECT_TIMES += 1;
                if (RECONNECT_TIMES >= 2) {
                    wx.showModal({
                        title: "异常信息",
                        content: "抱歉，服务器开了小差，稍等一会吧",
                        showCancel: false
                    });
                    //没有新的请求，10s之后清除重试次数
                    setTimeout(()=> RECONNECT_TIMES =0,10*1000);
                    return;
                }
                //获取当前请求信息
                let {url, method, data, header} = CURRENT_REQEST_PARAM;
                //===如果需要登录,则先登录在去请求
                LoginHepler.login().then(()=>http_request(url, method, data, header));
            } else if (errCode == 0 && +result.status == 1) {
                //把重连次数清0
                RECONNECT_TIMES = 0;
                //-------请求成功--------
                resolve(result);
            } else {
                //把重连次数清0
                RECONNECT_TIMES = 0;
                //------请求成功，但逻辑出现问题------
                windowHelper.popWrong(result.errmessage);
                reject(result);
            }
            //----不存在，说明调用的是其他的api接口
        } else {
            resolve(res.data)
        }
    }
}

module.exports.http = http;
