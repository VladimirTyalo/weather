"use strict";

var WEATHER_API_KEY = "d113902736c97ed02311db143b1d7e32";
var WEATHER_SERVICE_URL = "http://api.openweathermap.org/data/2.5/";

var loc = new CityLocation();
var weather = new Weather(WEATHER_SERVICE_URL, WEATHER_API_KEY);

loc.getLocationByIP()
   .then(function (location) {
     return weather.fetchForecast(location);
   })
   .then(function (forecastObj) {
     var forecastElements = document.querySelectorAll("[data-weather='forecast']");
     var forecastHandler = new ForecastElementHandler(forecastElements, forecastObj.list);
     var currentWeather = document.querySelector(".forecast__today");
     var weatherObj = forecastObj.list[0];
     setBackground(document.body, weatherObj);
     var weatherElementHandler = new WeatherElementHandler(currentWeather, weatherObj);

     forecastHandler.updateView();
     weatherElementHandler.updateView();
   });


function setBackground(element, weatherObj) {
  var generalDescription;
  try {
    generalDescription = weatherObj.weather[0].main.toLocaleLowerCase();
  }
  catch (e) {
    generalDescription = "default";
  }
  var img;
  switch(generalDescription) {
    case "clouds" : img = "img/storm-min.jpg";break;
    case "rain": img = "img/rain-min.jpg";break;
    case "snow": img = "img/snow-min.jpg"; break;
    case "default": img = "sunny-min.jpg";break;
    default: img = "sunny-min.jpg";
  }

  element.style["background-image"] = "url(" + img + ")";
}






































