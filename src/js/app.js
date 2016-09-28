"use strict";

var WEATHER_API_KEY = "d113902736c97ed02311db143b1d7e32";
var WEATHER_SERVICE_URL = "http://api.openweathermap.org/data/2.5/";
var currentWeatherSection = document.querySelector(".forecast__today");
var fiveDayForecastSection = document.querySelector(".forecast__long-period");

var loc = new CityLocation();
var weather = new Weather(WEATHER_SERVICE_URL, WEATHER_API_KEY);

var defferedForecastObject; // should be initialized before user click the forecast field

loc.getLocationByIP()
   .then(function (location) {
     return weather.fetchForecast(location);
   })
   .then(function (forecastObj) {
     var forecastElements = document.querySelectorAll("[data-weather='forecast']");
     defferedForecastObject = forecastObj;
     var forecastHandler = new ForecastElementHandler(forecastElements, forecastObj.list);

     var weatherObj = forecastObj.list[0];
     setBackground(document.body, weatherObj);
     var weatherElementHandler = new WeatherElementHandler(currentWeatherSection, weatherObj);

     forecastHandler.updateView();
     weatherElementHandler.updateView();
   });

forecastListenerInit(fiveDayForecastSection);


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


function forecastListenerInit(element) {

  element.addEventListener("click", function(ev) {
    ev.preventDefault();
    var target = getAncestor(ev.target ,function(el) {
      return el.classList.contains("forecast__item");
    });

    var targetIndex = Number.parseInt(target.getAttribute("forecast-index"));


    if(defferedForecastObject) {

      var singleDayForecast = defferedForecastObject.list[targetIndex];

      var weatherElementHandler = new WeatherElementHandler(currentWeatherSection, singleDayForecast);

      weatherElementHandler.updateView(targetIndex);
    }
  });
}


// find the ancestor of element  that match filter function criteria
function getAncestor(elem, filter) {
  var currElem = elem;

  while (currElem !== document) {
    if (filter(currElem)) {
      return currElem;
    }
    currElem = currElem.parentElement;
  }
}

function toArray($elems) {
  return Array.prototype.slice.call($elems);
}































