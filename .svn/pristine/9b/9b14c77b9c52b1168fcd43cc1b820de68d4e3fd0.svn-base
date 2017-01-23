// modules/market/optional/optional.js
var httpUtil = require('../../../common/http.js').http
var _const = require('../../../common/const.js').const
var util = require('../utils/util.js')

Page({
    data: {
        optionsData:[],
        tabs: ["个股详情", "个股消息"],
        sliderLeft: 0,
        activeIndex: 0,
        isDesc:false
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
    },
    getData:function(){//获取自选股
        var that = this
        var options = wx.getStorageSync('optional')
        if(options != null && options != ''){
            var codes = '';
            options = options.reverse()
            for(var i = 0;i<options.length;i++){
                codes += options[i]+','
            }
            if (codes .length > 1){
                codes = codes.substring(0,codes.length-1)
            }
            var params = {code:codes}
            httpUtil.get(_const.url.market_quotation,params).then(function (res) {
                if(res.data != null && res.data.length > 0){
                    that.setData({
                        optionsData:[]
                    })
                    var data = {};
                    for(var i = 0;i<res.data.length;i++){
                        data.name = res.data[i].name
                        data.code = res.data[i].code
                        data.price = res.data[i].price
                        data.change = res.data[i].change
                        data.changePct = res.data[i].changePct
                        data.color = util.getColorByZd(res.data[i].changePct)
                        that.setData({
                            optionsData:this.data.optionsData.concat(data)
                        })
                    }
                }
            }.bind(this))
        }
    },
    tabClick: function (e) {
        let index = e.currentTarget.id
        var activeIndex = 0;
        switch (index) {
            case "0":
                activeIndex = 0;
                break;
            case "1":
                activeIndex = 1;
                break;
        }
        this.setData({
            sliderLeft: e.currentTarget.offsetLeft,
            activeIndex: activeIndex
        });
    },
    sortChangePct:function(){
        var that = this
        this.data.optionsData.sort(function(a,b){
            if (that.data.isDesc){
                return a.change - b.change
            }else{
                return b.change-a.change
            }
        })
        this.setData({
            optionsData:this.data.optionsData,
            isDesc:!this.data.isDesc
        })
        // this.getData()
    },
    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {
        // 页面显示
        this.getData()
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    }
})

