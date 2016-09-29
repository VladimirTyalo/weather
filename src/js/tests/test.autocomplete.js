"use strict";
var should = chai.should();

var WEATHER_API_KEY = "d113902736c97ed02311db143b1d7e32";
var URL = "http://api.openweathermap.org/data/2.5/";


// to use chai eventually syntax
chai.use(chaiAsPromised);
chai.should();
var expect = chai.expect;


describe("test initial mocha setup", function(){
  it("should test if initial mocha setup is working", function(){
    expect(true).to.be.true;
  })
});



