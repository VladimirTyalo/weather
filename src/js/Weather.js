"use strict";
var $ = window.jQuery;
var url = "http://api.openweathermap.org/data/2.5/";

function Weather(webServiceURL, APIKey) {
  this._webServiceURL = webServiceURL;
  this._APIKey = APIKey;
}

Weather.prototype = {

  fetchCurrentWeather: function (place) {
    var result = this._fetchWeather(place);
    return result;
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

    var forecast = (future) ? "forecast" : "weather";
    var query = [forecast, "?q=", cityName, ",", countryCode, "&APPID=", key].join("");
    return Promise.resolve($.getJSON(url + query));
  },

  _queryWeatherByCityCode: function queryWeatherFromCityCode(url, key, cityCode, future) {
    var isLegalParams = url && key && cityCode;
    if (!isLegalParams) return Promise.reject(new Error("Illegal parameters"));

    var forecast = (future) ? "forecast" : "weather";
    var query = [forecast, "?id=", cityCode, "&APPID=", key].join("");
    return Promise.resolve($.getJSON(url + query));
  },

  _queryWeatherByLocation: function queryWeatherFromLocation(url, key, location, future) {
    var isLegalParams = url && key && location && location.lat && location.lon;
    if (!isLegalParams) return Promise.reject(new Error("Illegal parameters"));

    var forecast = (future) ? "forecast" : "weather";
    var query = [forecast, "?lat=", location.lat, "&lon=", location.lon, "", "&APPID=", key].join("");
    return Promise.resolve($.getJSON(url + query));
  }
};