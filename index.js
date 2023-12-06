
// Seu arquivo principal do servidor (ex: server.js)

const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const { Server } = require('socket.io');
const cors = require('cors');

app.use(cors());

const io = new Server(httpServer, {
  cors: {
    origin: ['https://interface.trevodev.repl.co', 'http://localhost:8080', 'http://outro-exemplo.com'],
    methods: ['GET', 'POST'],
  },
});


io.on('connection', (socket) => {
socket.on('disconnect', () => {
    console.log('user disconnected');
  });
 // console.log(`User Connected: ${socket.id}`);
  //console.log(socket)
   socket.on('join_room', (data) => {
    socket.join(data);
    console.log(data)
    // Emitir a lista completa de mensagens ao entrar na sala
    io.to(data).emit('all_messages', socket.messages || []);
  });

  socket.on('send_message', (data) => {
  console.log(data)
    // Atualizar a lista de mensagens do socket
    socket.messages = socket.messages || [];
    
    // Verificar se a mensagem já existe na lista antes de adicioná-la
    const isDuplicate = socket.messages.some(
      (msg) => msg.text === data.text && msg.author === data.author
    );

    if (!isDuplicate) {
      socket.messages.push(data);

      // Emitir a mensagem para a sala
      io.to(data.room).emit('receive_message', data);
    }
  });
});
app.get('/', (req, res) => {
 io.on('connection', (socket) => {
  socket.on('send_message', (data) => {
    res.json(data)
  });
 });
});


const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Servidor Socket.IO rodando na porta ${PORT}`);
});


