"use strict";

var url = "http://api.openweathermap.org/data/2.5/";

function Weather(webServiceURL, WEATHER_API_KEY) {
  this._webServiceURL = webServiceURL;
  this._APIKey = WEATHER_API_KEY;
  this._query;
}


Weather.prototype = {

  fetchCurrentWeather: function (place) {
    var currentTime = Date.now();
    var key = JSON.stringify(place);

    // cash info as {timestemp: _  , weatherObj: _}
    var cashed = JSON.parse(localStorage.getItem(key));

    if (cashed) {
      // check how old is the date
      // if it is older then 20 min  => 60* 60 * 1000 ms remove it from cash
      var DELAY = 1 * 60 * 1000;
      var timeStemp = +cashed.timeStemp;

      if (currentTime - timeStemp < DELAY) {

        return Promise.resolve(cashed.weatherObj);
      }

      // at this point info become outdated
      localStorage.removeItem(key);
    }

    var promise = this._fetchWeather(place)
                      .then(function (weatherObj) {

                        // save weather object to localStorage and reutrn new Promise with same Object
                        var cashed = JSON.stringify({ timeStemp: currentTime, weatherObj: weatherObj});

                        // if no errors save to the storage
                        if (weatherObj.main) {
                          localStorage.setItem(key, cashed);
                        }
                        return Promise.resolve(weatherObj);
                      });

    return promise;
  },

  fetchForecast: function (place) {
    return this._fetchWeather(place, true);
  },

  // future - true if you want forecast and false if you want current weather;
  _fetchWeather: function (place, future) {
    if (typeof place === "string" || typeof place === "number") {
      // handle weather request by city name or city Id
      var code;
      try {
        code = Number.parseInt(place);
        return this._queryWeatherByCityCode(this._webServiceURL, this._APIKey, code, future);
      }
      catch (e) {
        return Promise.reject(e);
      }
    }
    else if (typeof place === "object") {
      // handle weather request by position object {lat: "number" , lon: "number }
      if (place.lat && place.lon) {
        return this._queryWeatherByLocation(this._webServiceURL, this._APIKey, place, future);
      }
      // handle weather request by city object {city: "London", country: "en"}
      // use ISO 3166 country codes
      else if (place.city && place.country) {
        return this._queryWeatherByCityName(this._webServiceURL, this._APIKey, place.city, place.country, future);
      }
      else {
        return Promise.reject(new Error("Illegal argument place"));
      }
    }
  },

  _queryWeatherByCityName: function queryWeatherFromCityName(url, key, cityName, countryCode, future) {
    var isLegalParams = url && key && cityName && countryCode;
    if (!isLegalParams) return Promise.reject(new Error("Illegal parameters"));

    var forecast = (future) ? "forecast" : "find";
    var query = [forecast, "?q=", cityName, ",", countryCode, "&units=metric","&APPID=", key].join("");

    return Promise.resolve($.getJSON(url + query));
  },

  _queryWeatherByCityCode: function queryWeatherFromCityCode(url, key, cityCode, future) {
    var isLegalParams = url && key && cityCode;
    if (!isLegalParams) return Promise.reject(new Error("Illegal parameters"));

    var forecast = (future) ? "forecast" : "weather";
    var query = [forecast, "?id=", cityCode, "&units=metric", "&APPID=", key].join("");
    this._query = query;
    return Promise.resolve($.getJSON(url + query));
  },

  _queryWeatherByLocation: function queryWeatherFromLocation(url, key, location, future) {
    var isLegalParams = url && key && location && location.lat && location.lon;
    if (!isLegalParams) return Promise.reject(new Error("Illegal parameters"));

    var forecast = (future) ? "forecast" : "find";
    var latitude = encodeURIComponent(Number.parseFloat("" + location.lat));
    var longitude = encodeURIComponent(Number.parseFloat("" + location.lon));
    var query = [forecast, "?lat=", latitude, "&lon=", longitude, "&units=metric", "&APPID=", key].join("");
    this._query = query;
    return Promise.resolve($.getJSON(url + query));
  }
};