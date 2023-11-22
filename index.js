const express = require("express");
const app = express();

const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server);

app.use(express.static(path.resolve("")));

let arr = [];
let playingArr = [];
io.on("connection", (socket) => {
  console.log("connected");
  socket.on("find", (e) => {
    if (e.name != null) {
      arr.push(e.name);
      if (arr.length >= 2) {
        let p1 = {
          p1Name: arr[0],
          p1Value: "X",
          p1Move: "",
        };
        let p2 = {
          p2Name: arr[1],
          p2Value: "Y",
          p2Move: "",
        };
        let obj = {
          p1: p1,
          p2: p2,
          sum: 1,
        };
        playingArr.push(obj);
        arr.splice(0, 2);
        io.emit("find", { allPlayers: playingArr });
      }
    }
  });
  socket.on("playing", (e) => {
    if (e.value == "X") {
      let objToChange = playingArr.find((obj) => obj.p1.p1Name);
      objToChange.p1.p1Move = e.id;
      objToChange.sum++;
    } else if (e.value == "Y") {
      let objToChange = playingArr.find((obj) => obj.p2.p2Name);
      objToChange.p2.p2Move = e.id;
      objToChange.sum++;
    }
    io.emit("playing", { allPlayers: playingArr });
  });

  socket.on("gameOver", (e) => {
    // playingArr = playingArr.filter((item) => item.p1.p1Name !== e.name);
  });
});

app.get("/", (req, res) => {
  return res.sendFile("index.html");
});
server.listen(5000, () => {
  console.log("server running on port 5000");
});
