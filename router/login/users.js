
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

module.exports = users;
