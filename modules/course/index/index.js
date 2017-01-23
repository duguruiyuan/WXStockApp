/**
 * Created by caojie on 2017/1/15.
 * 课程首页
 */
const path = "../../../common/";
const {noteList,recommendData} =  require(path+"data.js").dataHepler;
const {dateUtil} = require(path+"utils.js")
const POSITION_ID_COURSE = 200103;
let page ={
    data:{
        "noMore":false,
        "recData":[],//推荐
        "courseList":[]//课程列表
    },
    getRecData:function () {
        this.recData = this.recData || new recommendData(POSITION_ID_COURSE);
        this.recData.nextPage(data => {
            data.forEach(item => dateUtil.formatDateForObject(item.contents,"note_time"));
            this.setData({"recData":data})
        });
    },
    getCourseList:function () {
        this.noteList = this.noteList || new noteList(2);
        !this.data.noMore &&
        this.noteList.nextPage(data => {
            wx.stopPullDownRefresh();
            if(data.length == this.data.courseList.length){
                this.setData({noMore:true});
            }else{
                this.setData({"courseList":data});
            }
        });
    },
    onLoad:function () {
        this.getRecData();
        this.getCourseList();
    },
    onReachBottom:function(){
        !this.noMore && this.getCourseList();
    },
    //上拉重新加载
    onPullDownRefresh:function () {
        this.recData = null;
        this.noteList = null;
        this.getCourseList();
    }
}
Page(page);

