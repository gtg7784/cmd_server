import User from '../models/user';

export const getUserByUsername = async (username) => {
  const users = await User.find().exec();

  let user;
  for (let i = 0; i < users.length; i++) {
    user = users[i];
    if (user.id === username) {
      return user;
    }
  }
  return null;
}