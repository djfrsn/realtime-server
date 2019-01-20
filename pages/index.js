import io from 'socket.io';

var socket = io('http://localhost/');
socket.on('connect', function () {
  socket.send('hi');

  socket.on('message', function (msg) {
    // my msg
  });
});

export default () => <div>Welcome to next.js!</div>
