"use strict";

var express = require("express");
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var PORT = process.env.port || 3000;
var assert = require('assert');
var path = require("path");

//var MongoClient = require("mongodb").MongoClient;
var config  = require("./src/config/config.js");
//var url = 'mongodb://<user>:<password>@ds053176.mlab.com:53176/city-locations';

app.set("port", PORT);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '/src')));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set("views", path.join(__dirname,"/src"));


app.use(function (req, res, next) {
  //// Website you wish to allow to connect
  //res.setHeader('Access-Control-Allow-Origin', config.servers.idea);

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Pass to next layer of middleware
  next();
});


//var fileContent = JSON.parse(fs.readFileSync("./src/js/vendor/iso-3166-country-codes.json", "utf-8"));
//
//var countryCodeMap = {};
//
//MongoClient.connect(url, function(err, db) {
//  var collection = db.collection("cities");
//
//  //collection.count({"country-name": {$exists: true}}).then(function(count) {
//  //    console.log(count);
//  //    db.close();
//  //});
//
//  fileContent["iso-codes"].forEach(function(el) {
//    countryCodeMap[el.alpha2] = el.name;
//    collection.updateMany({country: el.alpha2}, {$set: {"country-name": el.name}}, {upsert: true, w: 1}, function (err,
//      data) {
//      if (err) {
//        console.log(err);
//        return
//      }
//      console.log(data);
//      db.close();
//    });
//  });
//});


app.get("/", function(req,res) {
  req.send(index);
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







