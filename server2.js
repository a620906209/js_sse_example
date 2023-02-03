// app.js

const Koa = require('koa');
const Router =  require('koa-router');
const mysql = require('mysql2/promise'); // 安装：npm install --save mysql2

const app = new Koa();
const router = new Router();

app.context.appname = 'koa2';

router.get('/', async (ctx, next) => {
    const [rows] = await ctx.connection.query('SELECT * FROM `item` WHERE `item_id` > ?', [0]);
    ctx.type = 'text/html';
    // ctx.body = `${ctx.appname}, ${ctx.username}, ${rows[0].item_id},${rows[0].item_name}`;
    console.log(rows.length);
    ctx.body =``;
    rows.forEach(item => {
        ctx.body += `${item.item_id},${item.item_name},<hr>`;
    });
    
    // ctx.body = `${rows[0].item_id},${rows[0].item_name}`;
    

});

app.use(async (ctx, next) => {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'mydb'
    });
    ctx.connection = connection;
    ctx.username = 'hank';
    await next();
})
.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
})
.use(router.routes())
.use(router.allowedMethods())
.listen('8080',(err)=>{
    if(err){
        console.log('服仵器启动失败');
    }else{
        console.log('服务器启动成功');
    }
});