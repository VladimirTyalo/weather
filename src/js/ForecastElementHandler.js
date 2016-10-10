"use strict";

var WEATHER_API_KEY = "d113902736c97ed02311db143b1d7e32";
var WEATHER_SERVICE_URL = "https://api.openweathermap.org/data/2.5/";


function ForecastElementHandler(elements, forecastList) {

  this._elements = elements;  // list of elements with attribute 'data-weather'='forecast'
  this._forecastList = forecastList;  // up to 40 elements list with weatherObjects
  var self = this;

  this.updateView = function updateView() {

    for (var index = 0; index < self._elements.length; index++) {
      var el = self._elements[index];
      // weather measurements takes every 3 hours  => 3 * 8 = 24h => 1 day
      var weatherObjIndex = (index * 8 < self._forecastList.length) ? index * 8 : self._forecastList.length - 1;
      var weatherHandler = new WeatherElementHandler(el, self._forecastList[weatherObjIndex]);
      weatherHandler.updateView(weatherObjIndex);
    }
  };
}

