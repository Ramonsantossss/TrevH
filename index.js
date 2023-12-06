

const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const { Server } = require('socket.io');
const cors = require('cors');

app.use(cors());

const io = new Server(httpServer, {
  cors: {
    origin: 'https://interface.trevodev.repl.co', // Substitua pelo endereço do seu aplicativo React
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('join_room', (data) => {
    socket.join(data);

    // Emitir a lista completa de mensagens ao entrar na sala
    io.to(data).emit('all_messages', socket.messages || []);
  });

  socket.on('send_message', (data) => {
    // Atualizar a lista de mensagens do socket
    socket.messages = socket.messages || [];
    socket.messages.push(data);

    // Emitir a mensagem para a sala
    io.to(data.room).emit('receive_message', data);
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Servidor Socket.IO rodando na porta ${PORT}`);
});
