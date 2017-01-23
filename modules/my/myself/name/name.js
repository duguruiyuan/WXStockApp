// modules/my/myself/name.js
const update = require("../myself.js").update;
Page({
  data:{
    user_name:''
  },

  /**
   * 监听昵称输入
   */
  listenerNameInput: function(e) {
      this.data.user_name = e.detail.value;

  },

  updateName:function(){
    console.log('昵称为: ', this.data.user_name);
    if(this.data.user_name){
      update.updateName(this.data.user_name);
    }
  },

})