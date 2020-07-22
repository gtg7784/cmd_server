import * as Koa from 'koa';
import * as bcrypt from 'bcrypt';
import * as jsonwebtoken from 'jsonwebtoken';
import { getUserByUsername } from '../../utils/utils';
import User from '../../models/user';

const signin = async (ctx: Koa.Context, next: Koa.Next) => {
  const {
    id,
    password
  } = ctx.request.body;

  const user = await getUserByUsername(id);

  if(!user) {
    ctx.status = 401;
    ctx.body = {
      error: 'bad username'
    }

    return await next();
  }

  const { password: userPassword, ...userInfoWithoutPassword} = user;

  if (await bcrypt.compare(password, userPassword)){
    ctx.body = {
      token: jsonwebtoken.sign({
        data: userInfoWithoutPassword,
        exp: Math.floor(Date.now() / 1000) - (60 * 60)
      }, process.env.JWT_SECRET)
    }
    return await next();
  } else {
    ctx.status = 401;
    ctx.body = {
      error: 'wrong psasword'
    }
    
    return await next();
  }
}

const signup = async (ctx: Koa.Context, next: Koa.Next) => {
  let {
    id,
    password,
    passwordCheck,
    username
  } = ctx.request.body;

  if (!id || !password || !passwordCheck || !username){
    ctx.status = 400;
    ctx.body = {
      error: `expected an object with username, password, email, name but got: ${JSON.stringify(ctx.request.body)}`
    }
    return await next();
  }

  if(password !== passwordCheck){
    ctx.status = 401;
    ctx.body = {
      error: `expected an object with same password and passwordCheck, but got: ${JSON.stringify(ctx.request.body)}`
    }
    return await next();
  }

  const user = getUserByUsername(ctx.request.body.username);

  if (!user) {
    const passwordHashed = await bcrypt.hash(password, 5);;

    const userInfo = new User({
      id: id,
      password: passwordHashed,
      username: username
    })

    try {
      await userInfo.save();
    } catch (e) {
      ctx.status = 500
      ctx.body = {
        error: 'internal server error'
      }

      return await next();
    }
    ctx.status = 200;
    ctx.body = {
      message: 'registration success'
    };
    return await next();
  } else {
    ctx.status = 406;
    ctx.body = {
      error: 'User exists'
    }
    return await next();
  }
}

export {
  signin,
  signup
}