'use strict';

const express = require('express'),
  app = express(),
  http = require('http').createServer(app),
  io = require('socket.io')(http),
  path = require('path');

app.use('/styles', express.static(path.join(__dirname, 'styles')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

io.on('connection', socket => {
  console.log('an user connected');

  socket.broadcast.emit('hi');

  socket.on('chat message', msg => {
    console.log(`message: ${msg}`);
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
