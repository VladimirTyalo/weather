"use strict";
var should = chai.should();
var WEATHER_API_KEY = "d113902736c97ed02311db143b1d7e32";
var URL = "http://api.openweathermap.org/data/2.5/";


// to use chai eventually syntax
chai.use(chaiAsPromised);
chai.should();
var expect = chai.expect;
var describe = describe;


describe("sanity check", function () {
  it("is a function", function () {
    expect(true).to.be.true;
  });

  it("should cantain chai-as-promise lib", function () {
    expect(chaiAsPromised).to.exist;
  })
});

describe("check if Promise object is avaliable", function () {
  it("should contain Promise object", function () {
    expect(Promise).to.be.ok;
  })
});

describe("fetchCity()", function () {

  it("should return promise", function () {
    var result = fetchCity(1, 1);
    expect(result instanceof Promise).to.be.true;
  });

  //it("should contain 'NY' city as value of Promise // using done callback", function (done) {
  //  var expected = "NY";
  //  var result = fetchCity();
  //  result.then(function res(city) {
  //          expect(city).to.equal(expected);
  //        }, function rej(err) {
  //          expect(err).to.be.undefined;
  //        })
  //        .finally(done);
  //});

  it("should contain 'NY' city as value of Promise // duplication using Promises", function () {
    var expected = "NY";
    return fetchCity(1, 1).then(function res(city) {
      expect(city).to.equal(expected);
    }, function rej(err) {
      expect(err).to.not.exist;
    }).finally();
  });

  it("should accept longitude and latitude as parameters", function () {
    return fetchCity({}, 1).should.be.rejected;
  });

  it("should return city when passed correct parameters", function () {
    return fetchCity(3, 3).should.eventually.equal("NY");
  });
});

describe("Weather class", function () {

  var weather;

  before(function () {
    weather = new Weather(URL, WEATHER_API_KEY);
  });

  it("should exist", function () {
    expect(weather).to.exist;
  });

  describe("_getWeatherByCityName()", function () {

    it("should contain apiKey filed and url filed", function () {
      expect(weather._APIKey).to.not.be.undefined;
      expect(weather._webServiceURL).to.not.be.undefined;
    });

    it("should fulfilled current weather with correct parameters", function () {
      return weather._queryWeatherByCityName(URL, WEATHER_API_KEY, "London", "en")
        .should.eventually.be.fulfilled;
    });

    it("should be not fulfilled when calling with wrong params", function () {
      return weather._queryWeatherByCityName(URL).should.eventually.be.reject;
    });

    it("should return weather object with correct city name in it", function (done) {
      weather._queryWeatherByCityName(URL, WEATHER_API_KEY, "London", "en")
             .then(function (data) {
                 expect(data.name).to.be.equal("London");
                 done();
               },
               function (err) {
                 expect(err).to.be.undefined;
                 done();
               })
    });

    it("should return object with temp field in it", function () {
      return weather._queryWeatherByCityName(URL, WEATHER_API_KEY, "Samara", "ru")
                    .then(function (data) {
                      expect(data.main.temp).to.exist;
                    })
                    .catch(function (err) {
                      expect(err).to.not.exist;
                    })
    });

    it("should return forecast object when passed future param true", function () {
      return weather._queryWeatherByCityName(URL, WEATHER_API_KEY, "Samara", "ru", true)
                    .then(function (data) {
                      expect(data.list.length > 5).to.be.true;
                    })
                    .catch(function (err) {
                      expect(err).to.not.exist;
                    });
    });
  });


  describe("_getWeatherByCityCode()", function () {
    it("should fulfilled with correct params", function () {
      return weather._queryWeatherByCityCode(URL, WEATHER_API_KEY, 100).should.eventually.fulfilled;
    });

    it("should be rejected if not correct params are passed", function () {
      return weather._queryWeatherByCityCode(URL, WEATHER_API_KEY).should.eventually.be.reject;
    });

    it("should return correct city name in weather object", function () {
      var cityId = 6325521;
      var expectedName = "Levis";
      return weather._queryWeatherByCityCode(URL, WEATHER_API_KEY, cityId).then(function (weatherObj) {
        expect(weatherObj.name).to.equal(expectedName);
      });
    });
  });

  describe("_getWeatherByLocation", function () {
    it("should fulfilled with correct params", function () {
      return weather._queryWeatherByLocation(URL, WEATHER_API_KEY, {lat: 10, lon: 10}).should.eventually.fulfilled;
    });
    it("should fail with wrong params", function () {
      return weather._queryWeatherByLocation(URL, WEATHER_API_KEY, 10, 10).should.eventually.reject;
    });
    it("should return weather object with correct city name in it", function () {
      return weather._queryWeatherByLocation(URL, WEATHER_API_KEY, {"lon": 122.1726, "lat": -8.7289})
                    .then(function (weatherObj) {
                      expect(weatherObj.name).to.be.equal("Lela");
                    });
    });
  });

  describe("fetchCurrentWeather()", function () {
    it("should fullfilled with id as params", function () {
      var cityId = 6325521;
      var expectedName = "Levis";
      return weather.fetchCurrentWeather(cityId).then(function (obj) {
        expect(obj.name).to.equal(expectedName);
      });
    });
    it("should fulfilled with location obj as params", function () {
      return weather.fetchCurrentWeather({lat: 10, lon: 10}).should.eventually.fulfilled;
    });

    it("should fulfilled with city and country object as params ", function () {
      return weather.fetchCurrentWeather({city: "London", country: "en"}).should.eventually.fulfilled;
    });

    it("should reject with wrong parameters ", function () {
      return weather.fetchCurrentWeather({city: "London", country: "illegal value"}).should.eventually.reject;
    });
  });

  describe("fetchForecast()", function () {
    it("should fulfilled with correct params // city ID", function () {
      var cityId = 6325521;
      //var expectedName = "Levis";
      return weather.fetchForecast(cityId).should.eventually.fulfilled;
    });

    it("should fulfilled with correct params // city name and country", function () {
      var place = {city: "London", country: "en"};
      return weather.fetchForecast(place).should.eventually.fulfilled;
    });

    it("should fulfilled with correct params // location obj", function () {
      var place = {lat: 10, lon: 10};
      return weather.fetchForecast(place).should.eventually.fulfilled;
    });

    it("should return Promise with correct params", function () {
      return weather.fetchForecast({city: "London", country: "en"})
                    .then(function (forecastObj) {
                      console.log(forecastObj);
                      expect(forecastObj.list).to.exist;
                      expect(forecastObj.city).to.exist;
                      expect(forecastObj.city.name).to.be.equal("London");
                      expect(forecastObj.list.length > 5).to.be.true;
                    });
    });

  });

  describe("Location class", function () {
    var location;
    before(function () {
      location = new Location();
    });

    it("location object should exist", function () {
      expect(location).to.exist;
    });

    describe("getLocationByIP()", function () {
      it("should  fulfilled promise", function () {
        return location.getLocationByIP().should.eventually.fulfilled;
      });

      it("should contain promise with string loc property '{lat, lon}'", function () {
        return location.getLocationByIP().then(function (locationObj) {
          expect(locationObj.loc).to.exist;
        });
      });

    });
  });
});

describe.only("WeatherElementHandler class", function () {
  var weatherParams = ["temp", "wind", "humidity", "pressure", "wind", "description", "rain", "icon"];
  var weatherElement;
  var weatherHandler;
  var weatherObj;

  before(function before() {
    weatherObj = {
      "coord": {
        "lon": 145.77,
        "lat": -16.92
      },
      "weather": [
        {
          "id": 803,
          "main": "Clouds",
          "description": "broken clouds",
          "icon": "04n"
        }
      ],
      "base": "cmc stations",
      "main": {
        "temp": 293.25,
        "pressure": 1019,
        "humidity": 83,
        "temp_min": 289.82,
        "temp_max": 295.37
      },
      "wind": {
        "speed": 5.1,
        "deg": 150
      },
      "clouds": {
        "all": 75
      },
      "rain": {
        "3h": 3
      },
      "dt": 1435658272,
      "sys": {
        "type": 1,
        "id": 8166,
        "message": 0.0166,
        "country": "AU",
        "sunrise": 1435610796,
        "sunset": 1435650870
      },
      "id": 2172797,
      "name": "Cairns",
      "cod": 200
    }
    var locationObj = new Location();
    weatherElement = document.createElement("div");

    weatherParams.forEach(function (param) {
      var el = document.createElement("div");
      el.setAttribute("data-weather", param);
      weatherElement.appendChild(el);
    });

    document.body.appendChild(weatherElement);

    weatherHandler = new WeatherElementHandler(weatherElement, weatherObj, locationObj.getLocationByIP());
  });

  it("should has weatherElement", function () {
    document.body.appendChild(weatherElement);
  });

  describe.only("_findByAttribute(elem, attr)", function () {
    it("should containt temp attribute", function () {
      var elements = weatherHandler._findByAttribute(weatherElement, "data-weather");

      expect(elements["temp"]).to.exist;
      expect(elements["humidity"]).to.exist;
      expect(elements["rain"]).to.exist;
      expect(elements["wind"]).to.exist;
      expect(elements["icon"]).to.exist;
      expect(elements["undefinded value"]).to.not.exist;
    });

  });

  describe("_makeSimpleWeatherObject()", function() {
    it("should return correct value", function() {
      var expectedObj = {
        temp: 293.25,
        humidity: 83,
        wind: 5.1,
        pressure: 1019,
        rain: {'3h':3},
        description:  "broken clouds",
        icon: "04n"
      };

      var result = weatherHandler._makeSimpleWeahterObject(weatherObj);
      console.log(expectedObj);
      console.log(result);
      expect(weatherHandler._makeSimpleWeahterObject(weatherObj)).to.deep.equal(expectedObj);
    });

  });

  describe.only("updateView()", function() {
    it("should update element innerText", function() {
      var oldValue = weatherElement.querySelector("[data-weather='temp']").innerText;
      weatherHandler.updateView();
      var newValue = weatherElement.querySelector("[data-weather='temp']").innerText;
      console.log(newValue);
      expect(oldValue).to.not.equal(newValue);
    })
  })


});






