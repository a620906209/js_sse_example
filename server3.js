const Koa = require('koa');
const app = new Koa();
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mydb'
});

app.use(async ctx => {
  // SSE setup
  ctx.type = 'text/event-stream';
  ctx.set('Cache-Control', 'no-cache');
  ctx.set('Connection', 'keep-alive');

  // send initial data
  // ctx.body = 'data: Initial data\n\n';

  // setup a listener to receive new data from the database
  const query = connection.query('SELECT * FROM `item` WHERE `item_id` > ');
  query.on('result', row => {
    // send new data to the client
    ctx.body = 'data: ' + JSON.stringify(row) + '\n\n';
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
