import * as lowdb from 'lowdb';
import * as Filesync from "lowdb/adapters/FileSync"
import * as fs from 'fs';

fs.unlink("room.json", err => {
  if(err) throw err;
})

const adapter = new Filesync("room,json");
const roomDB = lowdb(adapter);
const searchAll = () => roomDB.get("roomData").value();
const setting = () => roomDB.defaults({ roomData: [] }).write();
const push = (data) => roomDB.get("roomData").push(data).write();
const leave = (data) => {
  const room = roomDB.get("roomData").find({ _id: data._id }).value();
  const player = room.player;
  if (player.length != 1 && data.master === true){
    player[1].master = true;
  } else if (player.length === 1){
    console.log(`Auto Room Dispose ... ${data._id}`);
    roomDB.get("roomData").remove({ _id: data._id }).write();
  }
  const UpdatePlayer = player.filter(value => value.nickname !== data.nickname);
  const people = room.connectedUsers - 1;
  roomDB.get('roomData')
    .find({ _id: data._id })
    .assign({ connectedUsers: people })
    .write();
  
  roomDB.get('roomData')
  .find({ _id: data._id })
  .assign({ player: UpdatePlayer })
  .write();
  
  return "방을 성공적으로 나갔습니다";
}