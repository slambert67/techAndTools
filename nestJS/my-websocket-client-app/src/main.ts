import { io } from 'socket.io-client';

async function bootstrap() {
  const socket = io('http://localhost:3001'); // notice 'http' for Socket.IO

  socket.on('connect', () => {
    console.log('Connected to Server');
    socket.emit('message_from_client', 'Hi from client!');
  });

  socket.on('message_from_server', (data) => {
    console.log('Received from Server:', data);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });

  socket.on('connect_error', (err) => {
    console.error('Connection error:', err.message);
  });
}

bootstrap();

