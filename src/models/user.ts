import { Schema, model } from 'mongoose';

const User = new Schema({
  id: String,
  password: String,
  username: String
})

export default model('User', User);