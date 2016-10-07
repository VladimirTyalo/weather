"use strict";

function LocationService() {
  LocationService.locationURL = "http://ipinfo.io/";
}

LocationService.prototype = {
  getLocationByIP: function () {
    return Promise.resolve(
      $.get(LocationService.locationURL, function (data) {}, "json").then(function (data) {
        var coordinats = data.loc.split(",");
        var lat = Number.parseInt(coordinats[0]);
        var lon = Number.parseFloat(coordinats[1]);
        return {lat: lat, lon: lon, city: data.city, country: data.country};
      }));
  }
};





