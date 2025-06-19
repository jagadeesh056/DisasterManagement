const socketIo = require('socket.io');

const initSockets = (server) => {
  const io = socketIo(server, { cors: { origin: '*' } });

  io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => console.log('Client disconnected'));
  });

  return io;
};

module.exports = { initSockets };