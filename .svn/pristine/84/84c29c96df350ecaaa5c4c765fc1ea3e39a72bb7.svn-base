// modules/my/myself/answer_price.js
const update = require("../myself.js").update;
Page({
  data:{
    answer_price:''
  },

  /**
   * 监听价格输入
   */
  listenerNumInput: function(e) {
      this.data.answer_price = e.detail.value;

  },

  updatePrice:function(){
    console.log('价格为: ', this.data.answer_price);
    if(this.data.answer_price){
      update.updatePrice(this.data.answer_price);
    }   
  },

})