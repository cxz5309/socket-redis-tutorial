const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const ns1 = io.of('/namespace1');
const ns2 = io.of('/namespace2');

ns1.on('connection', (socket)=>{
  console.log('a user connected in ns1');
  socket.on('disconnect', ()=>{
    console.log('user disconnected');
  })
  socket.on('chat message', (msg) => {
    console.log('msg1', msg)
    ns1.emit('chat message', msg);
  })
})

ns1.on('connection_error', (err) => {
  console.log(err.req);
  console.log(err.code);
  console.log(err.message);
  console.log(err.context);
})
ns2.on('connection', (socket)=>{
  console.log('a user connected in ns2');
  socket.on('disconnect', ()=>{
    console.log('user disconnected');
  })
  socket.on('chat message', (msg) => {
    console.log('msg2', msg)
    ns2.emit('chat message', msg);
  })
})

ns2.on('connection_error', (err) => {
  console.log(err.req);
  console.log(err.code);
  console.log(err.message);
  console.log(err.context);
})

server.listen(3000, ()=>{
    console.log('listening on 3000')
})