const Router = require("koa-router");
const home = new Router();

const db = require("../../utils/db");

home.get("/", async (ctx) => {
  let data = await new Promise((resolve, reject) => {
    let sql = `select * from hotword`;
    db.query(sql, (err, data) => {
      if (err) reject(err);
      resolve(data); // 返回拿到的数据
    });
  });
  let obj = {};
  obj.code = 200;

  let arr = [];
  let newdata=data.map((v) => {
    let brr = [];
    let obj = {};
    brr.push(v.content);
    obj = { name: v.name, content: brr };
    arr.push(obj);
    return arr;
  });
  obj.data = newdata[0];
  ctx.body = obj;
});

module.exports = home;
