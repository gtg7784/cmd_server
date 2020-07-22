import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import * as logger from 'koa-logger';
import * as json from 'koa-json';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

import ws from './modules/ws';
import api from './api';

dotenv.config();

const app = new Koa();
const router = new Router();
const port = process.env.PORT || 3000;

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(res => {
  console.log("Mongo DB Server Start");
})
.catch(err => console.error(err));

router.use('/api', api.routes());

// 401 handling
app.use((ctx, next) => {
  return next().catch((err) => {
    if (401 == err.status) {
      ctx.status = 401;
      ctx.body = 'Protected resource, use Authorization header to get access\n';
    } else {
      throw err;
    }
  });
});

app.use(json());
app.use(logger());
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

ws(app);

app.listen(port, () => {
  console.log(`Starting Server at http://localhost:${port}`);
})