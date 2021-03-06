"use strict";

// element's children should contain folowing attributes:
//  data-weather = "temp"
//  date-weather = "time"
//  data-weather = "humidity"
//  data-weather = "wind"
//  data-weather = "pressure"
//  data-weather = "description"
//  data-weather = "icon"

var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function WeatherElementHandler(element, weatherObj) {
  this._element = element;
  this._weatherObj = this._makeSimpleWeahterObject(weatherObj);
  this._elementsMap = this._findByAttribute(this._element, "data-weather");
  this._iconURl = "https://openweathermap.org/img/w/";
  this._cashIconElements = {};
}

function toStringWeekDay(timeStemp) {
  var day = (new Date(timeStemp)).getDay();
  switch (day) {
    case 0:
      return "Sun";
    case 1:
      return "Mon";
    case 2:
      return "Tue";
    case 3:
      return "Wed";
    case 4:
      return "Thu";
    case 5:
      return "Fri";
    case 6:
      return "Sat";
  }
}

function toStringMonth(timeStemp) {
  var month = (new Date(timeStemp)).getMonth();
  return monthNames[month];
}

WeatherElementHandler.prototype = {

  // create object with attribute values (temp/wind/pressure/ etc) as keys and DOM elements itself as values
  _findByAttribute: function findByAttribute(element, attribute) {
    var elemArray = Array.prototype.slice.call(element.querySelectorAll("[" + attribute + "]"));
    var reverseBinding = elemArray.reduce(function (acc, el) {
      acc[el.getAttribute("data-weather")] = el;
      return acc;
    }, {});
    return reverseBinding;
  },

  _makeSimpleWeahterObject: function(obj) {
    if(!obj) throw new Error("Illegal object weather");
    return {
      temp: (obj.main && obj.main.temp) ? obj.main.temp : "",
      time: (obj.dt) ? +obj.dt * 1000 : "",
      humidity: (obj.main && obj.main.humidity) ? obj.main.humidity : "",
      wind: (obj.wind && obj.wind.speed) ? obj.wind.speed : "",
      pressure: (obj.main && obj.main.pressure)? obj.main.pressure : "",
      description: (obj.weather && obj.weather[0] && obj.weather[0].description)? obj.weather[0].description : "",
      icon: (obj.weather && obj.weather[0] && obj.weather[0].icon)? obj.weather[0].icon : ""
    };
  },

  toCelcius: function (tempInFar) {
    try {
      var temp = (Number.parseFloat(tempInFar) - 32) / 1.8;
      return temp;
    } catch (e) {
      console.log(e);
    }
  },
  updateView:function(forecastIndex) {
    this._element.setAttribute("forecast-index", forecastIndex);
    for (var param in this._elementsMap) {
      if (this._elementsMap.hasOwnProperty(param)) {
        switch (param) {
          case "week-day":
          {
            var time = this._weatherObj.time;
            var day = toStringWeekDay(time);
            this._elementsMap[param].innerText = day;
            break;
          }
          case "month-day":
          {
            time = this._weatherObj.time;
            day = (new Date(time)).getDate();
            this._elementsMap[param].innerText = day;
            break;
          }
          case "month":
          {
            time = this._weatherObj.time;
            var month = toStringMonth(time);
            this._elementsMap[param].innerText = month;
            break;
          }
          case "icon":
          {
            var id = this._weatherObj[param];
            // to stop infinite animation
            $(".forecast__icon").find("img").removeClass("icon-animation-fly");
            document.body.offsetWidth;
            var icon = this._makeIconElement(id);

            this._elementsMap[param].appendChild(icon);

            $(".forecast__icon").find("img").addClass("icon-animation-fly");

            break;
          }
          case "humidity":
          {
            this._elementsMap[param].innerText = this._weatherObj[param] + "%";
            break;
          }
          case "wind":
          {
            this._elementsMap[param].innerText = this._weatherObj[param] + "m/s";
            break;
          }
          case "pressure":
          {
            this._elementsMap[param].innerText = this._weatherObj[param].toFixed(1) + "hPa";
            break;
          }
          default:
          {
            this._elementsMap[param].innerHTML = this._weatherObj[param] || "";
          }

        }

      }
    }
  },

  _makeIconElement: function (id) {
    if (this._cashIconElements[id]) {
      return this._cashIconElements[id];
    }

    var elem = document.createElement("img");
    var url = this._iconURl + encodeURIComponent(id) + ".png";
    elem.setAttribute("src", url);
    this._cashIconElements[id] = elem;
    return elem;
  }


};


