"use strict";


var config = config;

var inputWrapper = document.getElementById("input-wrapper");
var currentWeatherTable = document.getElementsByClassName("forecast__today")[0];
var fiveDayForecastTable = document.getElementsByClassName("forecast__long-period")[0];
var searchIcon = document.getElementById("search-icon");


function AutocompleteController(autoBox) {

  var keyActionMap = (autoBox !== undefined) ? {
    38: autoBox.prev,
    40: autoBox.next,
    9: autoBox.select
  } : {};

  var debouncedGetCityNames = debounce(getCityNames, 200);

  function initListeners() {
    window.addEventListener("keydown", function (ev) {
      var key = ev.keyCode;

      if (key === 9) {
        ev.preventDefault();
      }
      if (keyActionMap[key]) keyActionMap[key]();


    });

    $("input").keyup(function (ev) {
      var key = +ev.which;
      var $input = $(this);

      if ($input.val() == "") {
        autoBox.close();
        return;
      }

      if ([9, 37, 38, 39, 40].indexOf(key) < 0) {
        $input.attr("data-real-param", null);



        debouncedGetCityNames()
          .then(function (list) {
            if (list.length === 0) {
              autoBox.close();
              return;
            }
            autoBox.update(list);
          })
          .catch(function (err) {
            console.log(err);
          });

      }
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

    console.log("Sanding request");
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
      });

  }

  // evaluate function only if prev evaluation was later then "time" ago
  // otherwise return previous result;
  // this version don't take last entered result when it claimed in delay time interval
  // TODO refactor to use Promises
  function debounce(fn, time) {
    if (time <= 0) throw new Error("debouncing time should be greater then 0");
    var lastTime = -Infinity;
    var cashedResult;
    var self = this;

    return function debouncedFunction() {
      var delay = Date.now() - lastTime;
      var args = Array.prototype.slice.call(arguments);

      if (delay > time) {

        cashedResult = fn.apply(self, args);
        lastTime = Date.now();
      }
      return cashedResult;



    }
  }


  function cityToString(cityObj) {
    if (cityObj) {
      var lat = cityObj.coord.lat.toFixed(1);
      var lon = cityObj.coord.lon.toFixed(1);
      return cityObj.name + " // " + cityObj.country + " latitude: " + lat + " longitude: " + lon + "//" + cityObj.id;
    }
  }


  return {
    getCities: getCities,
    getCityNames: getCityNames,
    initListeners: initListeners
  }

}

