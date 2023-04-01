const Router = require("koa-router");
const event_img = new Router();
const path = require("path");

const body = require("koa-body");

/* const multer = require('koa-multer')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname ,'../../images/'))
    },
    filename: function (req, file, cb) {
        const fileFormat = (file.originalname).split('.')
        cb(null, Date.now() + '.' + fileFormat[fileFormat.length - 1])
    }
})  upload.single('file'),
const upload = multer({ storage }) */
const savePath = path.join(__dirname, "../../public/images"); // 文件资源存放的路径
event_img.use(
  body.koaBody({
    multipart: true,
    formidable: {
      keepExtensions: true,
      maxFieldsSize: 10 * 1024 * 1024,
      uploadDir: savePath,
    },
  })
);

event_img.post("/", async (ctx) => {
    
  ctx.body = {
    filename: "http://localhost:8888/images/" + ctx.request.files.file.newFilename, //返回文件名
    message: "success",
  };
});

module.exports = event_img;
