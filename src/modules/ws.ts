import * as socketio from 'socket.io';
import * as http from 'http';

const ws = (server: http.Server) => {
  const io = socketio(server, {
    origins: `${process.env.REQUEST_URI}`,
  });
  
  io.on('connection', (socket: socketio.Server) => {
    actions(socket);
  });
}

const actions = (socket: socketio.Server) => {
  socket.on('hello', (data: any) => {
    socket.emit('world', 'WORLD!');
    return;
  });

  socket.on('disconnect', (data: any) => {
    console.log('disconnected');
  });
}

export default ws;