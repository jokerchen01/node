const Koa = require("koa2");

const cors =require('koa2-cors')

const app = new Koa();

const static = require('koa-static');
 
app.use(static(__dirname + '/public', {
    index: false,    // 默认为true  访问的文件为index.html  可以修改为别的文件名或者false
    hidden: false,   // 是否同意传输隐藏文件
    defer: true      // 如果为true，则在返回next()之后进行服务，从而允许后续中间件先进行响应
}))



const port = 8888;

const router = require("./router/index");



app.use(cors())

app.use(router.routes(), router.allowedMethods());

app.listen(port, () => {
  console.log("Server is running at http://localhost:" + port);
});
