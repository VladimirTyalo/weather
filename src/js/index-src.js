"use strict";
var CITY_NY = "NY";
var CITY_CA = "CA";
var $ = jQuery;
var WEATHER_API_KEY = "d113902736c97ed02311db143b1d7e32";
var URL = "http://api.openweathermap.org/data/2.5/";



var CITY_LOCATIONS = {
  Dakar: {country: "SEN", lat: 14, long: 17},
  Milan: {country: "ITA", lat: 45, long: 9},
  London: {country: "GBR", lat: 51, long: 0},
  Rome: {country: "ITA", lat: 41, long: 12}
};


var WEATHER_MAP = {
  "NY": {temp: 10, wind: 1},
  "CA": {temp: 40, wind: 10}
};


function fetchCity(longitude, latitude) {
  return new Promise(function executor(resolve, reject) {

    var isCorrectParams = $.isNumeric(longitude) && $.isNumeric(latitude);
    setTimeout(function () {
      if (isCorrectParams) {
        resolve(CITY_NY);
      }
      else {
        reject(new Error("wrong parameters"));
      }
    });

  });
}

function fetchWeather(location) {
  if (typeof location === "string") {
    // handle weather request by city name or city Id
  }
  else if (typeof location === "object") {
    // handle weather request by position object {lat: "number" , lon: "number }
    return Promise.resolve((function () {
      var url = "http://api.openweathermap.org/data/2.5/";
      var query = ["forecast?lat=", location.lat, "&lon=", location.lon, "", "&APPID=", WEATHER_API_KEY].join("");
      return $.getJSON(url + query);
    }()));
  }
}


function getPositionByIp() {
  return Promise.resolve($.getJSON("http://ipinfo.io", function (data) {}));
}


getPositionByIp().then(function (data) {
                   var position = data.loc.split(",");
                   var lat = Number.parseInt(position[0]);
                   var lon = Number.parseInt(position[1]);
                   //return {lat: lat, lon: lon};
                   return {lat: 52, lon: 53};
                 })
                 .then(function (data) {
                   //return fetchWeather(data);
                 })
                 .then(function (data) {
                   //console.log(data.city.name);
                   //console.log(data.list[0]);
                 })
                 .catch(function (err) {
                   //console.log(err);
                 });



