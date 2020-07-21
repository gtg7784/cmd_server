import * as Router from 'koa-router';
import { signin } from './auth.controller'

const auth = new Router();

auth.get('/signin', signin)

export default auth;