const Router = require("koa-router");
const event_info = new Router();

const db = require("../../utils/db");
const body = require("koa-body");

event_info.use(
  body.koaBody({
    multipart: true,
  })
);
event_info.get("/", async (ctx) => {
  let id = ctx.query.id;
  let data = await new Promise((resolve, reject) => {
    let sql = `select * from event_info where id=${id}`;
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

function randomNum(n) {
  var t = "";
  for (var i = 0; i < n; i++) {
    t += Math.floor(Math.random() * 10);
  }
  return t;
}

//全局变量uuid
let uuid=''
event_info.post("/detail", async (ctx) => {
  let { ruleForm } = ctx.request.body;

  let classify=''
  for (let a of ruleForm.classify) {
    classify += a+'/';
  }
  classify=classify.slice(0,classify.length-1)

  let ImageList=[]

  if(ruleForm.ImageList.length){
    ImageList = ruleForm.ImageList.map((v) => {
      return {
        uid: v.uid,
        url: v.response.filename,
      };
    });
   
  }
  
  let ImageListString = `${JSON.stringify(ImageList)}`;
  await new Promise((resolve, reject) => {
     uuid = randomNum(10);

    let sql = `select * from event_info where id=${uuid}`;

    db.query(sql, (err, data) => {
      if (data.length) {
        reject(err);
      } else {
        resolve(data);
      }
      // 返回拿到的数据
    });
  }).then(() => {
    return new Promise((resolve, reject) => {
      let sql = `insert into event_info values('${ruleForm.title}','${classify}','${uuid}','${ruleForm.time}','${ruleForm.properties}','${ruleForm.level}','${ruleForm.position}','${ruleForm.street}','${ruleForm.community}','${ruleForm.describe}','${ruleForm.name}','${ruleForm.sex}','${ruleForm.phone}','${ImageListString}','${ruleForm.state}','${ruleForm.opinion}');`;

      db.query(sql, (err, data) => {
        if (err) reject(err);
        resolve(data); // 返回拿到的数据
      });
    }).then(() => {
      return new Promise((resolve, reject) => {
        let sql2 = `insert into event_search values('${ruleForm.title}','${uuid}','${ruleForm.name}','${ruleForm.street}','${classify}','${ruleForm.time}','${ruleForm.state}');`;
        db.query(sql2, (err, data) => {
          if (err) reject(err);
          resolve(data); // 返回拿到的数据
        });
      });
    }).then(()=>{
      return new Promise((resolve, reject) => {
        let sql3 = `insert into event_process(id) values('${uuid}');`;
        db.query(sql3, (err, data) => {
          if (err) reject(err);
          resolve(data); // 返回拿到的数据
        });
      });
    });
  });

  /*  await new Promise((resolve, reject) => {
    let sql = `insert into event_info values('${ruleForm.title}','${classify}','${ruleForm.id}','${ruleForm.time}','${ruleForm.properties}','${ruleForm.level}','${ruleForm.position}','${ruleForm.street}','${ruleForm.describe}','${ruleForm.community}','${ruleForm.name}','${ruleForm.sex}','${ruleForm.phone}','${ImageListString}','${ruleForm.state}');`;

    db.query(sql, (err, data) => {
      if (err) reject(err);
      resolve(data); // 返回拿到的数据
    });
  }).then(() => {
    return new Promise((resolve, reject) => {
      let sql2 = `insert into event_search values('${ruleForm.id}','${ruleForm.name}','${ruleForm.street}','${classify}','${ruleForm.time}','${ruleForm.state}');`;
      db.query(sql2, (err, data) => {
        if (err) reject(err);
        resolve(data); // 返回拿到的数据
      });
    });
  }); */

  let obj = {
    code: 200,
    message: "插入成功",
  };
  ctx.body = obj;
});


//修改事件状态
event_info.post("/save_state", async (ctx) => {

  let state= ctx.request.body.state;
  let opinion= ctx.request.body.opinion;
  let id= ctx.request.body.id;

  await new Promise((resolve, reject) => {
    let sql = `update  event_info set state='${state}',opinion='${opinion}' where id='${id}'`;
    db.query(sql, (err, data) => {
      if (err) reject(err);
      resolve(data); // 返回拿到的数据,
    });
  }).then(()=>{
    return new Promise((resolve, reject) => {
      let sql = `update  event_search set state='${state}' where id='${id}'`;
      db.query(sql, (err, data) => {
        if (err) reject(err);
        resolve(data); // 返回拿到的数据,
      });
    })
  });
  let obj={}
  obj.code=200
  obj.message='success'
  ctx.body = obj;
});

//全部事件详情
event_info.get("/all_event", async (ctx) => {

  let data = await new Promise((resolve, reject) => {
    let sql = `select * from event_info `;
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
module.exports = event_info;
