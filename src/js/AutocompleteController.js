"use strict";


var config = config;

var inputWrapper = document.getElementById("input-wrapper");
var currentWeatherTable = document.getElementsByClassName("forecast__today")[0];
var fiveDayForecastTable = document.getElementsByClassName("forecast__long-period")[0];
var searchIcon = document.getElementById("search-icon");


function AutocompleteController(autoBox) {

  var actionMap = (autoBox !== undefined) ? {38: autoBox.prev, 40: autoBox.next} : {};

  function initListeners() {
    $(window).keydown(function (ev) {
      var key = ev.which;
      if (actionMap[key]) actionMap[key]();

    });
  }

  function getCities() {
    var partialName = autoBox.getInputText();
    var pattern = "^" + partialName;
    var query = '{name:{$regex:"' + pattern + '",$options:"i"}}';
    var sort = '{name: 1}';
    var limit = 10;

    var url = [config.mongodb.restfulURL, "databases/city-locations/collections/cities",
      "?q=", query,
      "&s=", sort,
      "&l=", limit,
      "&apiKey=", config.mongodb.apiKey
    ].join("");

    return Promise.resolve($.ajax({
      url: url,
      type: 'GET',
      crossDomain: true,
      dataType: 'json'
    }));
  }


  function getCityNames() {
    return getCities()
      .then(function (list) {
        return $.map(list, function (el) {
          return cityToString(el);
        });
      })
      .then(function (list) {
        autoBox.update(list);
        return list;
      });
  }


  function cityToString(cityObj) {
    if (cityObj) {
      var lat = cityObj.coord.lat.toFixed(1);
      var lon = cityObj.coord.lon.toFixed(1);
      return cityObj.name + " " + cityObj.country + " latitude: " + lat + " longitude: " + lon;
    }
  }

  return {
    getCities: getCities,
    getCityNames: getCityNames,
    initListeners: initListeners
  }

}


