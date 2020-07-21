import * as Koa from 'koa';

const signin = async (ctx: Koa.Context, next: Koa.Next) => {
  ctx.body = {
    cmd: "signin api"
  }

  return await next;
}

export {
  signin
} 