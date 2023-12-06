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
    // Usar socket.emit para enviar a mensagem apenas para o socket que a enviou
    socket.emit('receive_message', {
      text,
      authorId: socket.id,
      author: socket.data.username || 'Anônimo',
    });

    // Usar io.emit para enviar a mensagem para todos os outros sockets conectados
    socket.broadcast.emit('receive_message', {
      text,
      authorId: socket.id,
      author: socket.data.username || 'Anônimo',
    });
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Servidor Socket.IO rodando na porta ${PORT}`);
});
