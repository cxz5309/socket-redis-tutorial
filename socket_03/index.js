const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', ()=>{
    console.log('user disconnected');
  })

  socket.on('join room1', () => {
    socket.join('room1');
  })

  socket.on('join room2', () => {
    socket.join('room2');
  })

  socket.on('room message', (msg) => {
    console.log('msg1', msg)
    io.to('room1').emit('room message', `room1 ${msg}`);
    socket.leave('room1');
  })
  
  socket.on('room message', (msg) => {
    console.log('msg2', msg)
    io.to('room2').emit('room message', `room2 ${msg}`);
    socket.leave('room2');
  })
  
  // socket.on('room message', (msg) => {
  //   console.log('msg3', msg)
  //   io.to('room1').to('room2').emit('room message', `room3 ${msg}`);
  // })
})

io.on('connection_error', (err) => {
  console.log(err.req);
  console.log(err.code);
  console.log(err.message);
  console.log(err.context);
})

server.listen(3000, ()=>{
    console.log('listening on 3000')
})