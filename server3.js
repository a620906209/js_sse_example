const Koa = require('koa');
const sse = require('koa-sse');

const app = new Koa();
app.use(sse());
app.use(async (ctx) => {
  if (ctx.path === '/events') {
    ctx.sseSetup();
    ctx.sseSend({ time: new Date() });
  } else {
    ctx.body = 'Not Found';
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});