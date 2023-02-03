const Koa = require("koa");
const { PassThrough } = require("stream");
const mysql = require('mysql2/promise');
const app = new Koa();

app.use(async (ctx, next) => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mydb'
});
ctx.connection = connection;
ctx.username = 'hank';
// await next();

// const [rows] = await ctx.connection.query('SELECT * FROM `item` WHERE `item_id` > ?', [0]);
ctx.type = 'text/html';
// console.log(rows.length);

  if (ctx.path !== "/sse") {
    return await next();
  }
  ctx.request.socket.setTimeout(0);
  ctx.req.socket.setNoDelay(true);
  ctx.req.socket.setKeepAlive(true);

  ctx.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Access-Control-Allow-Origin": "*",
  });

    const stream = new PassThrough();

    ctx.status = 200;
    ctx.body = stream;

    var rows="";
for(var i = 0;i<10; i++){
   [rows] = await ctx.connection.query('SELECT * FROM `item` WHERE `item_id` > ?', [0]);

    // setInterval(() => {
      var data = ["id","123"];
      // stream.write(`data:${rows[0].item_id},${rows[0].item_name},${rows[0].item_price}`);
      rows.forEach(item => {
        // ctx.body += `${item.item_id},${item.item_name},<hr>`;
        stream.write(`${item.item_id},${item.item_name}`);
    });
      stream.write(`\n\n`);
    }
    // }, 2000);
  })
  .use(ctx => {
    ctx.status = 200;
    ctx.body = "ok";
  })
  .listen(8080, () => console.log("Listening"));