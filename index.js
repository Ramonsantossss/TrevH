// seu-arquivo-principal.js

const http = require('http');
const express = require('express');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.json({ status: "Online" });
});

io.on('connection', (socket) => {
  console.log('Usuário conectado!', socket.id);

  socket.on('disconnect', () => {
    console.log('Usuário desconectado!', socket.id);
  });

  socket.on('set_username', (username) => {
    socket.data.username = username;
    console.log(`Nome de usuário definido para ${username}`);
  });

  socket.on('message', (text) => {
    console.log(`Mensagem recebida: "${text}" de ${socket.id}`);

    const author = socket.data.username || 'Anônimo';

    // Emitir a mensagem para todos os sockets conectados, incluindo o emissor
    io.emit('receive_message', {
      text,
      authorId: socket.id,
      author,
    });
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Servidor Socket.IO rodando na porta ${PORT}`);
});
