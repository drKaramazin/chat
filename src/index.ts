const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/html/index.html');
});

io.on('connection', function (socket) {
  console.log('an user connected');

  socket.broadcast.emit('hi');

  socket.on('chat message', function (msg) {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });

  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});