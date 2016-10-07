"use strict";

var express = require("express");
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var PORT = process.env.port || 3000;
var assert = require('assert');

var MongoClient = require("mongodb").MongoClient;
var config  = require("./src/config/config.js");
var url = config.mongodb.url;


app.set("port", PORT);
app.use(bodyParser.urlencoded({extended: true}));


// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', config.servers.idea);

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Pass to next layer of middleware
  next();
});


app.get("/cities", function (req, res) {
  var name = req.query.name;

  MongoClient.connect(url, function (err, db) {

    var collection = db.collection('cities');
    var pattern = "^" + name;

    collection.find({name: {$regex: pattern, $options: "i"}})
              .sort({name: 1})
              .limit(10)
              .toArray()
              .then(function (docs) {
                res.send(docs);
                db.close();
              });
  });


});


app.listen(PORT, function () {
  console.log("server started at port: " + PORT);
});







