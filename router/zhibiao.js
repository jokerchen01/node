const Router = require("koa-router");
const zhibiao = new Router();

const db = require("../utils/db");

zhibiao.get("/", async (ctx) => {
  let data = await new Promise((resolve, reject) => {
    let sql = `select * from zhibiao`;
    db.query(sql, (err, data) => {
      if (err) reject(err);
      resolve(data); // 返回拿到的数据
    });
  });
  let obj = {};
  obj.code = 200;
  obj.data = data[0];
  ctx.body = obj;
});

module.exports = zhibiao;


