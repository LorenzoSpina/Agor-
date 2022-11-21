const express = require('express');
const app = express();
const mongoose = require("mongoose");
const path = require('path')
const cors = require("cors");
const compression = require('compression');

let bodyParser = require('body-parser')

require("dotenv").config({ path: "./config.env" });
let helmet = require('helmet')
let session = require('express-session')

app.use(compression())
app.use(express.json())

app.use(bodyParser.urlencoded({ extended: true }))


let expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 ora

app.use(express.static(path.join(__dirname, '../frontend/build')));
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(function (req, res, next) {
  res.removeHeader("X-Powered-By");
  next();
});
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  name: 'sessionId',
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
  expires: expiryDate,
  cookie: {
    // settato a true funziona solo con https
    // secure: true,
    httpOnly: true
  }
}))

const dbo = require("./config/conn");

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  dbo.connectToServer()
  .catch(console.error)
  console.log(`server listening at http://localhost:${PORT}`)
});

mongoose.connect(
  process.env.ATLAS_DBM
)

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});

require('./routes/auth')(app)
app.use(require("./routes/Offered_Services"));
app.use(require("./routes/Required_Services"));
app.use(require("./routes/Unauthorised"))
app.use(require("./routes/user_corporate"))
app.use(require("./routes/chats"));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/../frontend/build', 'index.html'));
})