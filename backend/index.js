//richiamo express
const express = require('express');
const app = express();
//richiamo cors service per evitare problemi dipendenze nodejs
const cors = require("cors");
//carica da variabili locali moduli da installare o variabili di ambienti da usare
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
//richiamo il file delle route
app.use(require("./routes/service"));
//connessione db
const dbo = require("./db/conn");



app.listen(port, () => {
    //TODO inserire connessione db 
    dbo.connectToServer(function (err){
      if(err) console.error(err);
    });
    console.log(`Example app listening on port ${port}  `);
});