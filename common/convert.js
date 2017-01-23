/**
 * Created by qy on 2017/1/17.
 *
 * 数据转换,将Action转换为微信小程序可用的点击事件
 */

/**
 * 转换action
 * @param array
 */
function convertActionAry(array) {
    if (array != null && array.length > 0) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].action != null && array[i].action != '') {
                var res = convertAction(array[i].action)
                array[i].openType = res.split(',')[0]
                array[i].action = res.split(',')[1]
            }
        }
    }
}

function convertAction(action) {
    /**
     * 打开首页    jingu://home
     注册    jingu://register
     登录    jingu://login
     打开网页    jingu://web?url=http://123.com
     打开个股详情页    jingu://productdetails?code=sh000001
     打开振幅榜单/涨幅/跌幅    jingu://stockrank?type=swing/up/down
     打开板块    jingu://hottrade
     自选股    jingu://optionlstocks
     大盘指数    jingu://marketIndex
     虚拟交易    jingu://demoTrading
     真实炒股    jingu://realTrading
     开户交易    jingu://trade?type=open&id=(劵商的首字母)
     笔记列表/笔记详情    jingu://note?id={}
     课程列表/课程详情    jingu://course?id={}
     大咖详情/打开详情    jingu://bigname?id={}
     问股详情/问股列表    jingu://questionStock?id={}
     提问    jingu://ask
     消息中心论股    jingu://replay?code=1&name=1&id
     回答问股    jingu://answerStock?id
     */
    if (action.indexOf("jingu://home") != -1) {//打开首页
        return '';
    } else if (action.indexOf("jingu://register") != -1) {//注册
        return '';
    } else if (action.indexOf("jingu://login") != -1) {//登录
        return '';
    } else if (action.indexOf("jingu://web") != -1) {//打开网页
        return '';
    } else if (action.indexOf("jingu://productdetails") != -1) {// 打开个股详情页
        if (action.indexOf('?code=') != -1) {
            return 'navigate,'+'/modules/market/stock/stock' + action.substring("jingu://productdetails".length);
        } else {
            return 'switchTab,'+'/modules/market/market';
        }
    } else if (action.indexOf("jingu://stockrank") != -1) {// 打开振幅榜单/涨幅/跌幅
        return '';
    } else if (action.indexOf("jingu://hottrade") != -1) {// 打开板块
        return '';
    } else if (action.indexOf("jingu://optionlstocks") != -1) {//自选股
        return 'navigate,'+'/modules/market/optional/optional';
    } else if (action.indexOf("jingu://marketIndex") != -1) {// 大盘指数
        return '';
    } else if (action.indexOf("jingu://demoTrading") != -1) {// 虚拟交易
        return '';
    } else if (action.indexOf("jingu://realTrading") != -1) {// 真实炒股
        return '';
    } else if (action.indexOf("jingu://trade") != -1) {// 开户交易
        return '';
    } else if (action.indexOf("jingu://note") != -1) {// 笔记列表/笔记详情
        if (action.indexOf('?id=') != -1) {
            return 'navigate,'+'/modules/note/detail/detail' + action.substring("jingu://note".length);
        } else {
            return 'switchTab,'+'/modules/note/index/index';
        }
    } else if (action.indexOf("jingu://course") != -1) {// 课程列表/课程详情
        if (action.indexOf('?id=') != -1) {
            return 'navigate,'+'/modules/course/detail/detail' + action.substring("jingu://course".length);
        } else {
            return 'navigate,'+'/modules/course/index/index';
        }
    } else if (action.indexOf("jingu://bigname") != -1) {// 大咖详情/打开详情
        if (action.indexOf('?id=') != -1) {
            return 'navigate,'+'/modules/bigname/detail/detail' + action.substring("jingu://bigname".length);
        } else {
            return 'switchTab,'+'/modules/bigname/index/index';
        }
    } else if (action.indexOf("jingu://questionStock") != -1) {// 问股详情/问股列表
        if (action.indexOf('?id=') != -1) {
            return 'navigate,'+'/modules/questionStock/detail/detail' + action.substring("jingu://questionStock".length);
        } else {
            return 'switchTab,'+'/modules/questionStock/index/index';
        }
    } else if (action.indexOf("jingu://ask") != -1) {// 提问
        return '';
    } else if (action.indexOf("jingu://replay") != -1) {//消息中心论股
        return '';
    } else if (action.indexOf("jingu://answerStock") != -1) {// 回答问股
        return '';
    }else {
        return '';
    }
}


module.exports = {
    convertActionAry: convertActionAry,
    convertAction: convertAction
}