/**
 * Created by Administrator on 2016/11/14.
 */
const path = "../../common/";
const http = require(path + "http.js").http;
const urls = require(path + "const.js").const.url;
var app = getApp();
Page({

  data: {
    "title": "个人中心",
    "userInfo": {},
    //"is_":,//是否领取过免费大咖币
  },

  //获取个人信息
  getUserInfo: function () {
    http.get(urls.user_detail).then(res => {
      this.setData({ userInfo: res.data });
    });
  },
  //
  onLoad: function () {
    this.getUserInfo();
  },

  //领取免费大咖币
  freeMoney: function () {
    //跳转到专题页面../zt/zt
    wx.navigateTo({
      url: '../zt/zt'
    })
  }

})
