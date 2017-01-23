var http = require('http'); //引入http模块
var url = require('url'); //url模块 解析pathname
var fs = require('fs'); //fs模块 文件读取
var path = require('path'); //path模块 路径处理
var zlib = require('zlib'); //zlib模塊 啟用GZip压缩

var mime = require('./mime').types; //mime类型
var config = require('./config').config; //配置文件

var port = 80; //服务的端口
var rootdir = config.root || "";

//创建server
var server = http.createServer(function(request, response) {

    //解析pathname
    var pathname = url.parse(request.url).pathname;

    //默认替换最后的"/"为默认页
    if (pathname.slice(-1) === "/") {
        pathname += config.defaultPage;
    }

    //防止自定义的父路径 拼接真实路径
    var realPath = path.join(rootdir, path.normalize(pathname.replace(/\.\./g, "")));

    var pathHandel = function(realPath) {
		console.log(realPath);
        fs.stat(realPath, function(error, stat) {
            if (error) {
				console.log(error);
                response.writeHead(404, { 'Content-Type': 'text/plain' });
                response.write("This request URL " + pathname + " was not found on this server.");
                response.end();
            } else {
                if (stat.isDirectory()) {
                    realPath = path.join(realPath, "/", config.defaultPage);
                    pathHandel(realPath);
                } else {

                    console.log("real_path:" + realPath);

                    //获取文件名的后缀 .html .css
                    var ext = path.extname(realPath);
                    //去掉.号后面的
                    ext = ext ? ext.slice(1) : "unknown";

                    //设置mime类型
                    var contentType = mime[ext] || "text/plain";
                    response.setHeader("Content-Type", contentType);

                    var lastModified = stat.mtime.toUTCString();
                    response.setHeader("Last-Modified", lastModified);

                    response.setHeader("Access-Control-Allow-Origin","*");

                    //如果匹配缓存的类型,则设置http头信息 ，设置过期时间和缓存保留时间
                    if (ext.match(config.expires.fileMatch)) {
                        var expires = new Date();
                        expires.setTime(expires.getTime() + config.expires.maxAge * 1000);
                        response.setHeader("Expires", expires.toUTCString());
                        response.setHeader("Cache-Control", "max-age=" + config.expires.maxAge);
                    }

                    var ifModifiedSince = request.headers["If-Modified-Since".toLowerCase()];

                    if (ifModifiedSince && lastModified == ifModifiedSince) {
                        response.writeHead(304, "Not Modified");
                        response.end();
                    } else {
                        //防止文件过大 启用流 来读取文件
                        var raw = fs.createReadStream(realPath);
                        var acceptEncoding = request.headers['accept-encoding'] || "";
                        var matchd = ext.match(config.compress.match)
                        if (matchd && acceptEncoding.match(/\bgzip\b/)) {
                            response.writeHead(200, "Ok", { 'Content-Type': contentType, 'Content-Encoding': 'gzip' });
                            raw.pipe(zlib.createGzip()).pipe(response);
                        } else if (matchd && acceptEncoding.match(/\bdeflate\b/)) {
                            response.writeHead(200, "Ok", { 'Content-Type': contentType, 'Content-Encoding': 'deflate' });
                            raw.pipe(zlib.createDeflate()).pipe(response);
                        } else {
                            //不支持压缩的文件格式
                            response.writeHead(200, "Ok", { 'Content-Type': contentType });
                            raw.pipe(response);
                        }
                    }
                }
            }
        })
    }

    pathHandel(realPath);
});

server.listen(port); //监听端口
console.log('server running at port ' + port);
