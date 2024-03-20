import Router from "@koa/router";
import { koaBody } from "koa-body";

const router = new Router();

router.get("/", koaBody(), async (ctx) => {
  ctx.body = "Hello World!";
});

export default router;
