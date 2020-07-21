import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as logger from 'koa-logger';
import * as json from 'koa-json';

import api from './api';

const app = new Koa();
const router = new Router();
const port = process.env.PORT ?? 3000;

app.use(json());
app.use(logger());

router.use('/api', api.routes());

app.use(router.routes())
app.use(router.allowedMethods());

app.listen(port, () => {
  console.log("cmd server start");
})