const Router = require("koa-router");
const router = new Router({
  prefix: "/dev-api",
});
const hotOpintions = require("./home/hotOpintions");
const hotword = require("./home/hotword");

const zhibiao = require("./zhibiao");

const users = require("./login/users");

//事件操作
const event_search = require("./event/event_search");
const event_info = require("./event/event_info");

const event_community = require("./event/event_community");
const event_properties = require("./event/event_properties");
const event_street = require("./event/event_street");
const event_level = require("./event/event_level");
const event_img = require("./event/event_img");

//主页
router.use("/users", users.routes(), users.allowedMethods());
router.use("/zhibiao", zhibiao.routes(), zhibiao.allowedMethods());
router.use("/hotOpintions", hotOpintions.routes(), hotOpintions.allowedMethods());
router.use("/hotword", hotword.routes(), hotword.allowedMethods());






router.use("/event_search", event_search.routes(), event_search.allowedMethods());
router.use("/event_info", event_info.routes(), event_info.allowedMethods());

//router.use("/event_community", event_community.routes(), event_community.allowedMethods());
router.use("/event_properties", event_properties.routes(), event_properties.allowedMethods());
router.use("/event_street", event_street.routes(), event_street.allowedMethods());
router.use("/event_level", event_level.routes(), event_level.allowedMethods());
router.use("/event_img", event_img.routes(), event_img.allowedMethods());


module.exports = router;
