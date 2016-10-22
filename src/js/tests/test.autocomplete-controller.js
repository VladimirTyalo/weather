"use strict";

// to use chai eventually syntax
chai.use(chaiAsPromised);
chai.should();

var expect = chai.expect;

var WEATHER_API_KEY = "d113902736c97ed02311db143b1d7e32";
var WEATHER_SERVICE_URL = "http://api.openweathermap.org/data/2.5/";


var inputWrapper = document.getElementById("input-wrapper");
var currentWeatherTable = document.getElementsByClassName("forecast__today")[0];
var fiveDayForecastTable = document.getElementsByClassName("forecast__long-period")[0];
var searchIcon = document.getElementById("search-icon");


describe("AutocompleteController() ", function () {

  var input = document.querySelector("input");
  var autoBox = new AutocompleteBox(inputWrapper, []);
  var autoController;


  beforeEach(function () {
    autoController = new AutocompleteController(autoBox);
  });

  it("should init AutocompleteController class", function () {
    var controller = new AutocompleteController();

    expect(controller).to.exist;
  });

  describe("getCities()", function () {
    it("should return promise", function () {
      input.value = "Samara";
      return expect(autoController.getCities()).to.eventually.fulfilled;
    });

    it("should return promise contain object with city name as first object ", function () {
      var city = "London";
      input.value = city;
      return autoController.getCities(city).then(function (data) {
        var result = data[0].name;
        expect(result).to.equal(city);
      });
    });

    it("should contain no more then 10 objects", function () {
      var partialCityName = "Sam";
      input.value = partialCityName;
      return autoController.getCities().then(function (data) {
        var result = data.length;
        expect(result).to.be.below(11);
      });
    });
  });

  describe("getCityNames()", function () {
    it("should return promise with city name in first object", function () {
      function cityToString(city) {
        return city.name + " | " + city.country + " coordinates: [" + city.coord.lat.toFixed(1) + ", " + city.coord.lon.toFixed(1) + "] " + "|" + city.id;
      }

      autoBox = new AutocompleteBox(inputWrapper, [], "|");

      autoController = new AutocompleteController(autoBox, cityToString);
      autoController.initListeners();

      var city = "London";
      var regex = new RegExp("^" + city, "i");
      input.value = city;


      return autoController.getCityNames(cityToString).then(function (list) {
        expect(list[0].match(regex)).to.exist;
      });
    });
  });


});