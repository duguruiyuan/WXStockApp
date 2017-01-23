
import Promise from "../../../resources/lib/promise.min"
const path = "../../../common/";
const urls = require(path + "const.js").const.url;
const http = require(path + "http.js").http;
Page({
  /**
   * 初始化数据
   */
  data: {
    //修改个人信息
    //query_balance: apiDomain + "/api/bigname/user_set.do",
    //user_ico:'',//头像
    user_name: '',//用户名
    answer_price: '',//向我提问价格
  },
  
})

 let Update = {
    /**
     * 修改用户名
     */
    updateName: function (name) {
      return http.post(urls.query_user_set, {user_name: name }).then((data) => {
        wx.showToast({ title: "修改昵称成功", icon: "success", mask: true });
        return Promise.resolve();
      });
    },

    /**
     * 修改提问价格
     */
    updatePrice: function () {
      return http.post(urls.query_user_set, {user_name: this.user_name }).then((data) => {
        wx.showToast({ title: "修改价格成功", icon: "success", mask: true });
        return Promise.resolve();
      });
    }

  }


module.exports.update = Update;