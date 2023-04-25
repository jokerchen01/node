const Router = require("koa-router");
const event_process = new Router();

const db = require("../../utils/db");
const body = require("koa-body");

event_process.use(
  body.koaBody({
    multipart: true,
  })
);
event_process.get("/", async (ctx) => {
  let id = ctx.query.id;
  let data = await new Promise((resolve, reject) => {
    let sql = `select * from event_process where id=${id}`;
    db.query(sql, (err, data) => {
      if (err) reject(err);
      resolve(data); // 返回拿到的数据
    });
  });

  let obj = {};
  obj.code = 200;
  if ((data[0].process.length)) {
    let process = JSON.parse(data[0].process);
    obj.data = process[process.length - 1];
  }
  ctx.body = obj;
});

event_process.post("/process_detail", async (ctx) => {
  let id = ctx.request.body.id;
  let state = ctx.request.body.process.state;
  let data = await new Promise((resolve, reject) => {
    let sql = `select process from event_process where id=${id}`;
    db.query(sql, (err, data) => {
      if (err) reject(err);
      resolve(data); // 返回拿到的数据
    });
  });

  let new_process = [];
  let old_process = [];
  console.log(data[0].process);
  if (data[0].process) {
    old_process = JSON.parse(data[0].process);

    old_process.push(ctx.request.body.process);
  } else {
    old_process = [];
    old_process.push(ctx.request.body.process);
  }
  new_process = `${JSON.stringify(old_process)}`;
  await new Promise((resolve, reject) => {
    let sql = `update  event_process set process='${new_process}' where id='${id}'`;

    db.query(sql, (err, data) => {
      if (err) reject(err);
      resolve(data); // 返回拿到的数据
    });
  })
    .then(() => {
      return new Promise((resolve, reject) => {
        let sql = `update  event_search set state='${state}' where id='${id}'`;
        db.query(sql, (err, data) => {
          if (err) reject(err);
          resolve(data); // 返回拿到的数据,
        });
      });
    })
    .then(() => {
      return new Promise((resolve, reject) => {
        let sql = `update  event_info set state='${state}' where id='${id}'`;
        db.query(sql, (err, data) => {
          if (err) reject(err);
          resolve(data); // 返回拿到的数据,
        });
      });
    });
  let obj = {
    code: 200,
    message: "处置成功",
  };
  ctx.body = obj;
});

//全部流程
event_process.get("/all_process", async (ctx) => {
  let id = ctx.query.id;
  let data = await new Promise((resolve, reject) => {
    let sql = `select * from event_process where id=${id}`;
    db.query(sql, (err, data) => {
      if (err) reject(err);
      resolve(data); // 返回拿到的数据
    });
  });

  let obj = {};
  obj.code = 200;
  data[0]?obj.data=data[0]:obj.data={"process":"[]"}
  ctx.body = obj;
});
module.exports = event_process;
