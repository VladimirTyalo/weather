"use strict";


var config = config;

//var inputWrapper = document.getElementById("input-wrapper");
//var currentWeatherTable = document.getElementsByClassName("forecast__today")[0];
//var fiveDayForecastTable = document.getElementsByClassName("forecast__long-period")[0];
//var searchIcon = document.getElementById("search-icon");

// autoBox - autocomplete box object
// toAutoBoxItemFormat - function that excepts item object and converts it to string representation of this object (optional)

function AutocompleteController(autoBox, toAutoBoxItemFormat) {

  var keyActionMap = (autoBox !== undefined) ? {
    38: autoBox.prev,
    40: autoBox.next,
    9: autoBox.select
  } : {};



  var getItems = (toAutoBoxItemFormat) ? function () {
    return getCityNames.call(this, toAutoBoxItemFormat);
  } : getCityNames;

  function initListeners() {

    window.addEventListener("keydown", function (ev) {
      var key = ev.keyCode;

      if (key === 9) {
        if (autoBox.getInputText() === "") return;
        ev.preventDefault();
      }
      if (keyActionMap[key]) keyActionMap[key]();

      if (key == 13 || key == 27) {
        autoBox.close();
      }
    });

    var debouncedInputHandler = debounce(inputHandler, 300);

    $(autoBox.getInputElement()).on("input", debouncedInputHandler);

  }

  function inputHandler(ev) {
    var $input = $(autoBox.getInputElement());

    if ($input.val() == "") {
      ev.preventDefault();
      autoBox.close();
      return;
    }

    $input.attr("data-real-param", null);
    getItems().then(function (list) {
      // no records to put into autocomplete box => close it
      // and clean data-real-param attribute of <input>
      if (list.length === 0) {
        autoBox.close();
        autoBox.getInputElement().setAttribute("data-real-param", undefined);
        return;
      }

      autoBox.update(list);
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

  function getCityNames(cityToString) {
    return getCities()
      .then(function (list) {
        return $.map(list, function (el) {
          if (typeof cityToString === 'function') {
            return cityToString(el);
          }
          return _cityToString(el);
        });
      });
  }

  // return promise which resolves only after specific amount of time
  // with the parameters of the last call (successful or not)
  function debounce(fn, time) {
    if (time <= 0) reject(new Error("debouncing time should be greater then 0"));
    var lastTime = -Infinity;
    var self = this;
    var timer;
    return function () {
      var args = Array.prototype.slice.call(arguments);

      return new Promise(function exec(resolve, reject) {
        var delay = Date.now() - lastTime;
        if (timer) {
          clearInterval(timer);
        }
        if (delay > time) {
          lastTime = Date.now();
          resolve(fn.apply(self, args));
          timer = undefined;
        }
        else {
          timer = setTimeout(function () {
            resolve(fn.apply(self, args));
          }, time - delay);
        }
      });

    }
  }


  function _cityToString(cityObj) {
    if (cityObj) {
      var lat = cityObj.coord.lat.toFixed(1);
      var lon = cityObj.coord.lon.toFixed(1);
      var splitter = "//";
      return cityObj.name + splitter + cityObj["country-name"] + " latitude: " + lat + " longitude: " + lon + splitter + cityObj.id;
    }
  }


  return {
    getCities: getCities,
    getCityNames: getCityNames,
    initListeners: initListeners
  }

}


