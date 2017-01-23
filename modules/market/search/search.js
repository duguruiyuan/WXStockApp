var httpUtil = require('../../../common/http.js').http
var _const = require('../../../common/const.js').const
const txtUtil = require('../../../common/utils.js').txtUtil
var stockData = require('../kline/stockData.js')
var app = getApp()
Page({
    data: {
        focus: false,//输入框焦点
        inputValue: '000',//输入的信息
        searchData: [],//股票列表
        pagesize: 10,//页数
        pagenum: 1,//页码
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        this.setData({
            focus: true
        })
        this.getData()
    },
    //获取数据
    getData: function () {

        var that = this

        var timestamp = 'suggestdata_'+Date.parse(new Date())
        wx.request({
            url:'http://suggest3.sinajs.cn/suggest/type=11&key='+this.data.inputValue+'&name='+timestamp,
            success:res=>{
                if(res.statusCode == 200){
                    var result = res.data;
                    if (result.length > 10){
                        var data = txtUtil.subTxt(result,timestamp.length+6,result.length-3)
                        if (data != null && data != "" && data != undefined){
                            var stocks = data.split(';')
                            var dataAry = [];
                            for(var i=0;i<stocks.length;i++){
                                var info = stocks[i].split(',')
                                dataAry.push({code:info[3],name:info[4],id:info[0]})
                            }
                            that.setData({
                                searchData:dataAry
                            })
                        }
                    }
                }
            }
        })

        // console.log(timestamp)
        // let params = {
        //     // ticker: this.data.inputValue,
        //     // pagesize: this.data.pagesize,
        //     // pagenum: this.data.pagenum
        //     key:this.data.inputValue,
        //     name:timestamp
        // }
        // httpUtil.get('http://suggest3.sinajs.cn/suggest/type=11', params).then(function (res) {
        //     console.log(res.data)
        //     if (res.data != null && res.data.length > 0) {
        //
        //     }
        // }.bind(this))
    },
    searchStock:function (val) {
// console.log('-----'+val.detail.value+JSON.stringify(val) )
        this.setData({
            inputValue:val.detail.value
        })
        this.getData()
    },
    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {
        // 页面显示
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    }
})