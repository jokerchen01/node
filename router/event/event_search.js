const Router = require("koa-router");
const event_search = new Router();

const db = require("../../utils/db");


event_search.get("/", async (ctx) => {
  let data = await new Promise((resolve, reject) => {
    let sql = `select * from event_search`;
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

event_search.get("/id", async (ctx) => {
  let {id}=ctx.request.query

    let data = await new Promise((resolve, reject) => {
      let sql = `select * from event_info where id=${id}`;
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

event_search.get("/state", async (ctx) => {
let {id}=ctx.request.query
let {state}=ctx.request.query

  let data = await new Promise((resolve, reject) => {
    let sql = `select * from event_info where id=${id} and state='${state}'`;
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

module.exports = event_search;
