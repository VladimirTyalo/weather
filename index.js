"use strict";

var express = require("express");
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var assert = require('assert');
var path = require("path");
var request = require('request');

var PORT = process.env.PORT || 3000;


app.set("port", PORT);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '/src')));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set("views", path.join(__dirname, "/src"));

app.get("/", function (req, res) {
  res.send(index);
});

app.get("/weather/:param/", function (req, res) {
  var query = toQueryString(req);
  var url = "http://api.openweathermap.org/data/2.5/" + req.params.param + query;

  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(JSON.parse(body));
    }
  })


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


function toQueryString(req) {
  var res = "?";
  for (var key in req.query) {
    if (req.query.hasOwnProperty(key)) {
      res += key + "=" + req.query[key] + "&";
    }
  }
  // remove last & character;
  return res.slice(0, -1);
}




