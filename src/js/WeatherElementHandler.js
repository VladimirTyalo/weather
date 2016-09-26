"use strict";

var $ = window.jQuery;

// element should contain folowing attributes:
//  data-weather = "temp"
//  data-weather = "humidity"
//  data-weather = "wind"
//  data-weather = "pressure"
//  data-weather = "description"
//  data-weather = "rain"
//  data-weather = "icon"


function WeatherElementHandler(element, weatherObj, locationObj) {
  this._element = element;
  this._weatherObj = this._makeSimpleWeahterObject(weatherObj);
  this._locationObj = locationObj;
  this._elementsMap = this._findByAttribute(this._element, "data-weather");
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

  _makeSimpleWeahterObject(obj) {
    return {
      temp: obj.main.temp,
      humidity: obj.main.humidity,
      wind: obj.wind.speed,
      pressure: obj.main.pressure,
      rain: obj.rain, // {'3h':3} ??
      description: obj.weather[0].description,
      icon: obj.weather[0].icon
    }
  },

  updateView() {
    console.log("---------- " + this._elementsMap.temp.innerText);
    for(var param in this._elementsMap) {
      if(this._elementsMap.hasOwnProperty(param)){
        console.log(param);
        this._elementsMap[param].innerHTML = this._weatherObj[param];
      }
    }

    console.log("---------- " + this._elementsMap.temp.innerText);
  }



};


