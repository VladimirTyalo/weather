"use strict";
var should = chai.should();
var WEATHER_API_KEY = "d113902736c97ed02311db143b1d7e32";
var URL = "http://api.openweathermap.org/data/2.5/";


// to use chai eventually syntax
chai.use(chaiAsPromised);
chai.should();
var expect = chai.expect;



describe("sanity check", function () {
  it("is a function", function () {
    expect(true).to.be.true;
  });

  it("should cantain chai-as-promise lib", function () {
    expect(chaiAsPromised).to.exist;
  })

  it("should have localStorage", function () {
    expect(localStorage).to.exist;
  });
});

describe("check if Promise object is avaliable", function () {
  it("should contain Promise object", function () {
    expect(Promise).to.be.ok;
  })
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

    it("should return weather object with correct city name in it", function () {
      return weather._queryWeatherByCityName(URL, WEATHER_API_KEY, "London", "en")
                    .then(function (data) {
                        expect(data.list[0].name).to.be.equal("London");
                      },
                      function (err) {
                        expect(err).to.be.undefined;
                      })
    });

    it("should return object with temp field in it", function () {
      return weather._queryWeatherByCityName(URL, WEATHER_API_KEY, "London", "en")
                    .then(function (data) {
                      expect(data.list[0].main.temp).to.exist;
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
      var cityId = 713514;
      var expectedName = "Alupka";
      return weather._queryWeatherByCityCode(URL, WEATHER_API_KEY, cityId)
                    .then(function (weatherObj) {
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
      return weather._queryWeatherByLocation(URL, WEATHER_API_KEY, {"lon": 33.733334, "lat": 44.416668})
                    .then(function (weatherObj) {
                      expect(weatherObj.list[0].name).to.be.equal("Laspi");
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
                      expect(forecastObj.list).to.exist;
                      expect(forecastObj.city).to.exist;
                      expect(forecastObj.city.name).to.be.equal("London");
                      expect(forecastObj.list.length > 5).to.be.true;
                    });
    });

  });

  describe("Location class", function () {
    var loc;
    before(function () {
      loc = new CityLocation();
    });

    it("location object should exist", function () {
      expect(loc).to.exist;
    });

    describe("getLocationByIP()", function () {
      it("should  fulfilled promise", function () {
        return loc.getLocationByIP().should.eventually.fulfilled;
      });

      it("should contain promise with string lot and lon property ", function () {
        return loc.getLocationByIP().then(function (locationObj) {
          expect(locationObj.lat).to.exist;
          expect(locationObj.lon).to.exist;
        });
      });

    });
  });
});

describe("WeatherElementHandler class", function () {
  var weatherParams = ["temp", "time", "wind", "humidity", "pressure", "wind", "description", "rain", "icon"];
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
    };
    var locationObj = new CityLocation();
    weatherElement = document.createElement("div");

    weatherParams.forEach(function (param) {
      var el = document.createElement("div");
      el.setAttribute("data-weather", param);
      weatherElement.appendChild(el);
    });

    weatherHandler = new WeatherElementHandler(weatherElement, weatherObj, locationObj.getLocationByIP());
  });

  describe("_findByAttribute(elem, attr)", function () {
    it("should containt temp attribute", function () {
      var elements = weatherHandler._findByAttribute(weatherElement, "data-weather");

      expect(elements["temp"]).to.exist;
      expect(elements["humidity"]).to.exist;
      expect(elements["rain"]).to.exist;
      expect(elements["wind"]).to.exist;
      expect(elements["icon"]).to.exist;
      expect(elements["time"]).to.exist;
      expect(elements["undefinded value"]).to.not.exist;
    });

  });

  describe("_makeSimpleWeatherObject()", function () {
    it("should return correct value", function () {
      var expectedObj = {
        temp: 293.25,
        time: 1435658272 * 1000,
        humidity: 83,
        wind: 5.1,
        pressure: 1019,
        rain: 3,
        description: "broken clouds",
        icon: "04n"
      };

      var result = weatherHandler._makeSimpleWeahterObject(weatherObj);

      expect(result).to.deep.equal(expectedObj);
    });

  });

  describe("updateView()", function () {
    it("should update element innerText", function () {
      var oldValue = weatherElement.querySelector("[data-weather='temp']").innerText;
      weatherHandler.updateView();
      var newValue = weatherElement.querySelector("[data-weather='temp']").innerText;
      expect(oldValue).to.not.equal(newValue);

    });
  });


  describe("toCelcius(tempInFarinh)", function () {
    it("should convert farinheit to celcius correctly", function () {
      var val = -20;
      var expected = -28.89;
      expect(weatherHandler.toCelcius(val)).to.be.within(expected - 0.1, expected + 0.1);
    });
  });


});






