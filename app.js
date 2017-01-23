/**
 * Created by cj on 2016/1/9.
 * 程序全局共享的逻辑和数据
 */
import Promise from "resources/lib/promise.min"
//全局工具类
const CONST = require("common/const.js").const;
const loginHelper = require("common/login.js").loginHelper;
var stockData = require("./modules/market/kline/stockData.js");
App({
    globalData:{
        userInfo:null,
        systemInfo:null,
        netWorkType: "",
        WIFI_REFRESH_INTERVAL: 5 * 1000,//wifi网络时刷新间隔 秒
        MOBILE_REFRESH_INTERVAL: 30 * 1000,//手机网络时刷新间隔 秒
        screenWidth: 0
    },
    /**
     * app 启动时执行一次
     */
    onLaunch:function () {
      let that = this;
      let expires = wx.getStorageSync(CONST.sessionExpiresKey) || 0;
      //session 过期,登录
      if (parseInt(expires) < Date.now()) {
        loginHelper.login().then(userInfo => {
            that.globalData.userInfo = userInfo;
        });
      }
      this.getSystemInfo()
      this.getSysNetWork()
      stockData.getAllStocks()
    },

    //获取系统信息
    getSystemInfo:function () {
       !this.globalData.systemInfo &&
        wx.getSystemInfo({
          success:res => {
            this.globalData.systemInfo = res
            this.globalData.screenWidth = res.windowWidth
            }
        });
    },

    getSysNetWork:function () {
        wx.getNetworkType({
          success:res => {
           this.globalData.netWorkType = res.networkType
          }
        })
    },
    getUserInfo:function () {
        let userInfo = this.globalData.userInfo || wx.getStorageSync(CONST.UserInfoKey);
        return userInfo;
    }
    
});

