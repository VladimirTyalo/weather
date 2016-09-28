"use strict";

function CityLocation() {
  CityLocation.serviceURL = "http://ipinfo.io/";
}

CityLocation.prototype = {
  getLocationByIP: function () {
    return Promise.resolve(
      $.get(CityLocation.serviceURL, function (data) {}, "json").then(function (data) {
        var coordinats = data.loc.split(",");
        var lat = Number.parseInt(coordinats[0]);
        var lon = Number.parseFloat(coordinats[1]);
        return {lat: lat, lon: lon, city: data.city, country: data.country};
      }));
  }
};





