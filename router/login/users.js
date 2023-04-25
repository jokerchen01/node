const Router = require("koa-router");
const users = new Router();

const db = require("../../utils/db");
const jwt = require("jsonwebtoken");

const body = require("koa-body");

users.use(
  body.koaBody({
    multipart: true,
  })
);

let global_token = "";

users.post("/", async (ctx) => {
  let username = ctx.request.body.username;
  let password = ctx.request.body.password;

  let result = await new Promise((resolve, reject) => {
    let sql = `SELECT * FROM users WHERE username='${username}'`;

    return db.query(sql, (err, data) => {
      if (err) throw err;
      if (data.length > 0) {
        resolve(data);
      } else {
        resolve(false);
      }
    });
  });

  if (result) {
    // 能找到对应的账号

    global_token = jwt.sign(
      { username: username, password: password },
      "secret",
      { expiresIn: 60 }
    );
    if (result[0].password == password) {
      // 账号密码正确，返回token
      console.log(result);
      ctx.body = {
        token: global_token,
        msg: "登录成功",
        code: 200,
      };
    } else {
      // 密码错误
      ctx.body = {
        msg: "密码错误",
      };
    }
  }
});

users.post("/logout", async (ctx) => {
  global_token = "";

  ctx.body = {
    token: global_token,
    msg: "退出成功",
    code: 200,
  };
});

//登录个人中心
users.post("/user_info", async (ctx) => {
  let username = ctx.request.body.username;
  let data = await new Promise((resolve, reject) => {
    let sql = `SELECT * FROM users WHERE username='${username}'`;
    db.query(sql, (err, data) => {
      if (err) reject(err);
      resolve(data); // 返回拿到的数据
    });
  });
  let obj = {};
  obj.code = 200;
  obj.data = data;
  ctx.body = obj;
});

//修改个人信息UPDATE
users.post("/user_change", async (ctx) => {
  let { form } = ctx.request.body;

  let data = await new Promise((resolve, reject) => {
    let sql = `update  users set sex='${form.sex}',name='${form.name}',email='${form.email}',phone='${form.phone}',age='${form.age}' where username='${form.username}'`;
    db.query(sql, (err, data) => {
      if (err) reject(err);
      resolve(data); // 返回拿到的数据,
    });
  });
  let obj = {};
  obj.code = 200;
  obj.message = "success";
  ctx.body = obj;
});

//权限模块 查询全部用户
users.get("/all_users", async (ctx) => {
  let data = await new Promise((resolve, reject) => {
    let sql = `select * from users `;
    db.query(sql, (err, data) => {
      if (err) reject(err);
      resolve(data); // 返回拿到的数据
    });
  });

  let obj = {};
  obj.code = 200;
  obj.data = data;
  ctx.body = obj;
});

//删除该用户
users.delete("/all_delete", async (ctx) => {
  let data = await new Promise((resolve, reject) => {
    let name = ctx.query.name;
    console.log(name);
    let sql = `delete  from users where name='${name}'`;
    db.query(sql, (err, data) => {
      if (err) reject(err);
      resolve(data); // 返回拿到的数据
    });
  });

  let obj = {};
  obj.code = 200;
  obj.message = "success";
  ctx.body = obj;
});

//增加新用户
users.post("/new_user", async (ctx) => {
  let data = await new Promise((resolve, reject) => {
    let { users } = ctx.request.body;

    let sql = `insert into users (username,password,name,street) values('${users.username}','${users.password}','${users.name}','${users.street}')`;
    db.query(sql, (err, data) => {
      if (err) reject(err);
      resolve(data); // 返回拿到的数据
    });
  });

  let obj = {};
  obj.code = 200;
  obj.message = "success";
  ctx.body = obj;
});
module.exports = users;
