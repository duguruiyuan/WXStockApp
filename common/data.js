/**
 * Created by caojie on 2017/1/13.
 * 数据工厂类，请求数据
 */
const urls = require("const.js").const.url;
const http = require("http.js").http;
const utils = require("utils.js");
const [common,dateUtil,txtUtil] = [utils.common,utils.dateUtil,utils.txtUtil];
class SuperData {
    constructor(page_no = 1, page_size = 10) {
        this.page_no = page_no;
        this.page_size = page_size;
        this.data = [];
    }

    handelData(res) {
        let items = res.data;
        this.page_no += 1;
        Array.prototype.push.apply(this.data, items);
    }
}

/**
 * 推荐数据
 */
class RecommendData {
    constructor(positionid, page_no, page_size) {
        this.page_no = page_no;
        this.page_size = page_size;
        this.positionid = positionid;
        this.data = [];
    }

    nextPage(cb) {
        let param = {};
        ({positionid: param.positionid} = this);
        //-----如果page_no不等于空,page_size不等于空,表明是分页查询,则加入到请求参数
        let isPageination = common.isNotNull(this.page_no) && common.isNotNull(this.page_size);
        isPageination &&
        ({page_no: param.page_no, page_size: param.page_size} = this);
        http.get(urls.recommend, param).then(res=> {
            if (isPageination) {
                this.page_no += 1;
            }
            //过滤掉不含有contents属性的推荐内容
            res.data = [...res.data].filter(item => common.hasProperty(item,"contents"));
            Array.prototype.push.apply(this.data, res.data);
            typeof cb == "function" && cb(this.data);
        });

    }
}

/**
 * 大咖列表数据
 * @param list_type 列表类型 1我关注的  2全部、默认全部
 * @param order_type 排序方式 1 order_type的值倒序、2 关注量倒序、 默认最近发布笔记日期倒序
 * @constructor
 */
class BignameList extends SuperData {
    constructor(list_type = 2, order_type = 1) {
        super();
        [this.list_type, this.order_type] = [list_type, order_type];
    }

    nextPage(cb) {
        let params = {
            page_no: this.page_no,
            page_size: this.page_size,
            list_type: this.list_type,
            order_type: this.order_type
        };
        http.get(urls.bigname_list, params).then(res => {
            this.handelData(res);
            typeof cb == "function" && cb(this.data);
        });
    }
}

/**
 * 笔记列表
 * @params note_type 笔记类型
 * @params list_type 列表类型  :1 我关注的、 2全部数据（默认）、3我阅读的、4  大咖写的、 5我写的  7、我收藏的
 * @params authorid 作者id list_type = 4必须传
 * @params order_type 排序方式 1 order_type的值倒叙、2 阅读量倒叙、3 时间倒叙
 */
class NoteList extends SuperData {
    constructor(note_type, list_type = 2, authorid, order_type = 1) {
        super();
        //-----note_type 必须传
        if (common.isNull(note_type)) {
            throw "note_type 参数不能为空"
        }
        if (list_type == 4 && common.isNull(authorid)) {
            throw "authorid不能为空"
        }
        this.note_type = note_type;
        this.list_type = list_type;
        this.authorid = authorid;
        this.order_type = order_type;
    }

    nextPage(cb) {
        let param = {
            page_no: this.page_no,
            page_size: this.page_size,
            note_type: this.note_type,
            list_type: this.list_type,
            order_type: this.order_type
        }
        //--策略或者资讯-----
        if (this.note_type == 1) {
            param.note_type2 = 3
        }
        if (param.list_type == 4) {
            param.authorid = this.authorid
        }
        http.get(urls.note_list, param).then(res => {
            txtUtil.limitTxtForObjects(res.data,[
                {field:"title",length:50},
            ]);
            dateUtil.formatDateForObjects(res.data,"create_time");
            this.handelData(res);
            typeof cb == "function" && cb(this.data);
        })

    }
}

/**
 *问股列表
 * @param list_type 列表类型  :1 我关注的、 2全部数据(默认)、3我听过的 、4我问的、5大咖回答的 、6我回答的（大咖自己）、7我收藏的
 * @param answer_userid 回答人id list_type = 5,参数必须传
 * @param key_word 搜索关键字
 */
class QuestionList extends SuperData {
    constructor(list_type = 2, answer_userid, key_word="") {
        if (list_type == 5 && common.isNull(answer_userid)) {
            throw "answer_userid 不能为空"
        }
        super();
        this.list_type = list_type;
        this.answer_userid = answer_userid;
        this.key_word = key_word;
    }

    nextPage(cb) {
        let param = {page_no: this.page_no, page_size: this.page_size};
        ({list_type: param.list_type, key_word: param.key_word} = this);
        if (param.list_type == 5) {
            param.answer_userid = this.answer_userid
        }
        http.get(urls.question_list, param).then(res => {
            dateUtil.formatDateForObjects(res.data,"create_time");
            dateUtil.formatDateForObjects(res.data,"question_time");
            this.handelData(res);
            typeof cb == "function" && cb(this.data);
        });
    }
}

/**
 * 笔记评论列表
 * @param noteid 笔记id
 */
class NoteCommentList extends SuperData {
    constructor(noteid) {
        super();
        this.noteid = noteid;
    }

    nextPage(cb) {
        let param = {};
        ({page_no: param.page_no, page_size: param.page_size, noteid: param.noteid} = this);
        http.get(urls.note_comment_list, param).then(res => {
            this.handelData(res);
            typeof cb == "function" && cb(this.data);
        })
    }
}

/**
 * 个人中心-我的关注
 */

/**
 * 个人中心-我的收藏
 */

/**
 * 个人中心-我的足迹
 */

/**
 * 个人中心-消费记录
 * expenseList:收入
 * payList:支出
 */
class expenseList extends SuperData {
    constructor() {
        super();
    }
    nextPage(cb) {
        let param = {page_no: this.page_no, page_size: this.page_size};
        http.get(urls.query_Income, param).then(res => {
            dateUtil.formatDateForObjects(res.data,"createTime");
            this.handelData(res);
            typeof cb == "function" && cb(this.data);
        });
    }
}
class payList extends SuperData {
    constructor() {
        super();
    }
    nextPage(cb) {
        let param = {page_no: this.page_no, page_size: this.page_size};
        http.get(urls.query_Consurme, param).then(res => {
            dateUtil.formatDateForObjects(res.data,"createTime");
            this.handelData(res);
            typeof cb == "function" && cb(this.data);
        });
    }
}
/**
 * 个人中心-我的消息
 */



module.exports.dataHepler = {
    recommendData: RecommendData,
    bignameList: BignameList,
    noteList: NoteList,
    questionList: QuestionList,
    noteCommentList: NoteCommentList,
    expenseList:expenseList,
    payList:payList
};
