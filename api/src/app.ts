import Koa from "koa";
import logger from "koa-logger";
import router from "./router";

const app = new Koa();
app.use(logger()).use(router.routes()).use(router.allowedMethods());

app.listen(8080);
