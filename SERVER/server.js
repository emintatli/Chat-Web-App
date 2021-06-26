const express = require('express');
const app = express();
const http = require('http');
var cors = require('cors');
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
      origin: "https://chat-app-private.vercel.app",
      methods: ["GET", "POST"]
    }
  });

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

io.on('connection', (socket) => {
    socket.on("message",(msg)=>{
        io.to(msg.target).emit("message",{message:msg.message,from:msg.from,time:Date.now()});
        console.log(`${msg.message} from :${msg.from} time:${msg.time}`)
    })
    socket.on("join",(msg)=>{
        socket.join(msg.target)
        console.log(msg.target)
    })
    socket.on('disconnect', () => {
        console.log('user disconnected');
      });
  });

server.listen(process.env.PORT||5000, () => {
  console.log('listening on *:5000');
});