const express = require('express');
const app = express();

const cors = require("cors");

let bodyParser = require('body-parser')

require("dotenv").config({ path: "./config.env" });
let helmet = require('helmet')
let session = require('express-session')

app.use(express.json())

app.use(bodyParser.urlencoded({ extended: true }))


let expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 ora

app.use(cors());
app.use(express.json());
app.use(helmet())
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

const io = require("socket.io")(server, {
  pingTimeout: 60000,
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

app.get('/', (req,res) => {
  res.json('Welcome to Bazar web site!')
})

require('./routes/auth')(app)

app.use(require("./routes/Offered_Services"));
app.use(require("./routes/Required_Services"));

app.use(require("./routes/Unauthorised"))

app.use(require("./routes/user_corporate"))

//inizio codice modulare chat
app.use(require("./routes/chats"));
//app.use(require("./routes/message"));