"use strict";
var should = chai.should();

var WEATHER_API_KEY = "d113902736c97ed02311db143b1d7e32";
var URL = "http://api.openweathermap.org/data/2.5/";
var LocationService = LocationService;

// to use chai eventually syntax
chai.use(chaiAsPromised);
chai.should();
var expect = chai.expect;


describe("LocationService class", function () {
  var loc;
  before(function () {
    loc = new LocationService();
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