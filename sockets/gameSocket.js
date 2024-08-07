// sockets/gameSocket.js
const socketIo = require('socket.io');

let io;
let users = {};

const initGameSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: 'http://localhost:3001', // Replace with your React app's URL
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join', (userId) => {
      users[userId] = socket.id;
      console.log(`${userId} has joined with socket ID ${socket.id}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      for (const userId in users) {
        if (users[userId] === socket.id) {
          delete users[userId];
          break;
        }
      }
    });
  });
};

const getSocketInstance = () => io;
const getUsers = () => users;

module.exports = { initGameSocket, getSocketInstance, getUsers };
