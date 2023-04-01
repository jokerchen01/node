const Router = require("koa-router");
const home = new Router();

const db = require("../../utils/db");

home.get("/", async (ctx) => {
  let data = await new Promise((resolve, reject) => {
    let sql = `select * from appeal`;
    db.query(sql, (err, data) => {
      if (err) reject(err);
      resolve(data); // 返回拿到的数据
    });
  });
  let obj={}
  obj.code=200
  obj.data=data
  ctx.body = obj;
});

module.exports = home;
