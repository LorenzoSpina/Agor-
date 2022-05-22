/**
 * File per gli endPoint relativi ai servizi 
 * url da aggiornare in fase di testing per controllare il db
 */

const { response } = require("express");
const express = require("express");

//usati per definire le route dell'applicazione
const serviceRoutes = express.Router();

//richiamo connessione db
const dbo = require("../db/conn");

//utile per convertire gli id da String to ObjectId per _id
const ObjectId = require("mongodb").ObjectId;

serviceRoutes.route("/service").get(function (req, res){
    let db_connect = dbo.getDb("services");
    db_connect
    .collection("service")
    .find({})
    .toArray(function (err, result){
        if (err) throw err;
        res.json(result);
    });
});

serviceRoutes.route("/service/:id").get(function (req, res){
    let db_connect = dbo.getDb("services");
    let query = { _id: ObjectId(req.params.id)};
    db_connect
    .collection("service")
    .findOne(query, function(err, result){
        if(err) throw err;
        res.json(result);
    });
});

serviceRoutes.route("/service/").post(function (req, response){
    let db_connect = dbo.getDb();
    let myService = {
        name: req.body.name,
        type: req.body.type,
        description: req.body.description,
        price: req.body.price,
    };
    db_connect.collection("service").insertOne(myService, function (err, res){
        if(err) throw err;
        response.json(res);
    });
});

serviceRoutes.route("/service/:id").post(function (req, response){
    let db_connect = dbo.getDb();
    let query = { _id: ObjectId(req.params.id)}
    let newService = {
        $set: {
            name: req.body.name,
            type: req.body.type,
            description: req.body.description,
            price: req.body.price,
        },
    }
    db_connect.collection("services").updateOne(query, newService, function(err, res){
        if(err) throw err;
        response.json(res);
    });
});

serviceRoutes.route("service/:id").delete((req, response) => {
    let db_connect = dbo.getDb();
    let query = { _id: ObjectId(req.params.id)};
    db_connect.collection("service").deleteOne(query, function (err, obj){
        if (err) throw err;
        console.log("1 document deleted");
        response.json(obj);
    });
});

module.exports = serviceRoutes;