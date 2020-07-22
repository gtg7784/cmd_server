import * as Router from 'koa-router';
import { signin, signup } from './auth.controller'

const auth = new Router();

auth.post('/signin', signin)
auth.post('/signup', signup)

export default auth;