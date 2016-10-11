"use strict";

var WEATHER_API_KEY = "d113902736c97ed02311db143b1d7e32";
var WEATHER_SERVICE_URL = "/weather/";

var currentWeatherSection = document.querySelector(".forecast__today");
var fiveDayForecastSection = document.querySelector(".forecast__long-period");
var loc = new LocationService();
var weather = new Weather(WEATHER_SERVICE_URL, WEATHER_API_KEY);
var defferedForecastObject; // should probably be initialized before user click the forecast field


var inputWrapper = document.querySelector(".header__search");
var input = inputWrapper.querySelector("input");
var $title = $(".header__city-name");

var autoBox = new AutocompleteBox(inputWrapper, [], "|");
var autoBoxController = new AutocompleteController(autoBox, cityToString);
var searchIcon = document.querySelector(".header__search-icon");


autoBoxController.initListeners();

window.addEventListener("click", clickHandler);
window.addEventListener("keypress", function pressEnter(ev) {
  if (ev.keyCode === 13) {
    submit(ev);
  }
});


loc.getLocationByIP()
   .then(function (location) {
     return weather.fetchForecast(location);
   })
   .then(function (forcastObj) {
     $title.text(forcastObj.list[0].name);
     updateForecastView(forcastObj);
   })
   .catch(function (err) {
     errorPopUp();
   })
   .finally();

forecastListenerInit(fiveDayForecastSection);


// helper functions

function errorPopUp(err) {
  console.log(err);
  var $error = $("<div>Can't find this city in database. Please enter another city!</div>");
  $error.addClass("error");
  $(inputWrapper).prepend($error);

  $error.delay(1500).fadeOut("slow", function () {
    $(this).remove();
  });
}

function clickHandler (ev) {
  var target = ev.target;
  var id = target.getAttribute("data-real-param");
  // click on search icon
  if (target == searchIcon) {
    submit(ev);
  } // click on one of the popup fields
  else if (id && id != "undefined" && id != "null" && target != input) {
    autoBox.setActive(id);
    submit(ev);
  } // click in any other area
  else {
    autoBox.close();
  }
}

function submit(ev) {
  autoBox.close();
  var id = input.getAttribute("data-real-param");
  if (id  && id !== "null" && id !== "undefined") {

    weather.fetchForecast(id)
           .then(function (forcastObj) {
             $title.text(forcastObj.city.name);
             updateForecastView(forcastObj);
           })
           .catch(errorPopUp)
           .finally();

  }
  else {

    if (input.value == "" || input.value == undefined) {
      errorPopUp();
      return;
    }
    autoBoxController.getCities()
                     .then(function (cities) {
                       return cities[0].id;
                     })
                     .then(function (id) {
                       return weather.fetchForecast(id);
                     })
                     .then(function (forecastObj) {
                       var cityName = forecastObj.city.name.toLowerCase();
                       // if comment below code it will allow to peek first city from the list
                       // even if it not fully typed
                       if(cityName != input.value.toLowerCase()) {
                         errorPopUp();
                         throw new Error("no such city in database");
                       }
                       $title.text(forecastObj.city.name);
                       updateForecastView(forecastObj);
                     })
                     .catch(errorPopUp)
                     .finally();
  }
}

function updateForecastView(forecastObj) {
  var forecastElements = document.querySelectorAll("[data-weather='forecast']");
  defferedForecastObject = forecastObj;
  var forecastHandler = new ForecastElementHandler(forecastElements, forecastObj.list);

  var weatherObj = forecastObj.list[0];

  setBackground(document.body, weatherObj);
  var weatherElementHandler = new WeatherElementHandler(currentWeatherSection, weatherObj);

  forecastHandler.updateView();
  weatherElementHandler.updateView();
}


// listen to forecast element area and trigger changes in current weather area according to selected day
function setBackground(element, weatherObj) {
  var generalDescription;
  try {
    generalDescription = weatherObj.weather[0].main.toLocaleLowerCase();
  }
  catch (e) {
    generalDescription = "default";
  }
  var img;
  switch (generalDescription) {
    case "clouds" :
      img = "img/storm-min.jpg";
      break;
    case "rain":
      img = "img/rain-min.jpg";
      break;
    case "snow":
      img = "img/snow-min.jpg";
      break;
    case "default":
      img = "img/sunny-min.jpg";
      break;
    default:
      img = "img/sunny-min.jpg";
  }

  element.style["background-image"] = "url(" + img + ")";
}


function forecastListenerInit(element) {

  element.addEventListener("click", function (ev) {
    ev.preventDefault();
    var target = getAncestor(ev.target, function (el) {
      return el.classList.contains("forecast__item");
    });

    var targetIndex = Number.parseInt(target.getAttribute("forecast-index"));


    if (defferedForecastObject) {

      var singleDayForecast = defferedForecastObject.list[targetIndex];

      setBackground(document.body, singleDayForecast);

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


function cityToString(city) {
  return [
    city.name,
    " | ", city["country-name"],
    //" coordinates: [",
    //city.coord.lat.toFixed(1), ", ", city.coord.lon.toFixed(1), "] ",
    "|", city.id
  ].join("");
}











