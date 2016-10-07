"use strict";
var WEATHER_API_KEY = "d113902736c97ed02311db143b1d7e32";
var URL = "http://api.openweathermap.org/data/2.5/";


// to use chai eventually syntax
chai.use(chaiAsPromised);
chai.should();
var expect = chai.expect;


describe("test Autocomplete box", function () {

  var element = document.getElementById("input-wrapper");
  var input = element.getElementsByTagName("input")[0];

  var list = ["Anapa", "Amsterdam", "Bolton", "Birminhem", "Bristol", "Briton", "Larnaka", "Liverpool", "Littlewood", "London"];
  var autocompleteBox;

  function clean() {

    var element = document.getElementById("input-wrapper");
    var popup = element.querySelectorAll(".autocomplete-box__popup");
    var input = element.querySelector("input");
    input.setAttribute("value", "");
    input.value = "";

    autocompleteBox = new AutocompleteBox(element, list);
    Array.prototype.slice.call(popup).forEach(function (el) {
      el.parentNode.removeChild(el);
    });
  }

  beforeEach(function () {
    clean();
  });

  afterEach(function () {
    clean();
  });


  it("should test if initial mocha setup is working", function () {
    expect(true).to.be.true;
  });


  it("should get DOM element and list/array as constructor parameters otherwise throw error", function () {
    expect(AutocompleteBox).to.throw();
  });

  it("element should contain class ='autocomplete-box'", function () {
    expect(element.classList.contains("autocomplete-box")).to.be.true;
  });


  describe("open() method", function () {


    it("should have elements in popup when typing words", function () {
      autocompleteBox.open();
      var result = Array.prototype.slice
                        .call(element.querySelectorAll("[data-index]"))
                        .map(function (el) {
                          return el.innerText;
                        });
      expect(list).to.have.all.members(result);
    });

    it("should initially have active class on first element", function () {
      autocompleteBox.open();
      var result = element.querySelector("[data-index]");

      expect(result.classList.contains("autocomplete-box__popup-item--active")).to.be.true;
    });

    it("should add only one popup elment", function () {
      var popups = element.querySelectorAll(".autocomplete-box__popup");
      expect(popups.length).to.be.equal(0);

      autocompleteBox.open();
      autocompleteBox.open();
      autocompleteBox.open();
      autocompleteBox.open();

      var popups = element.querySelectorAll(".autocomplete-box__popup");

      expect(popups.length).to.be.equal(1);
    });
  });

  describe("close() method", function () {


    it("popup should not be present", function () {
      var popups = element.querySelectorAll(".autocomplete-box__popup");

      expect(popups.length).to.be.equal(0);

      autocompleteBox.open();
      autocompleteBox.close();
      popups = element.querySelectorAll(".autocomplete-box__popup");

      expect(popups.length).to.be.equal(0);
    });
  });

  describe("next() method", function () {

    it("should not change active element if popup is closed", function () {
      autocompleteBox.next();
      var popups = element.querySelectorAll(".autocomplete-box__popup-item--active");
      expect(popups.length).to.be.equal(0);
    });
    it("should change active state element to the next one", function () {
      autocompleteBox.open();
      autocompleteBox.next();
      var popups = element.querySelectorAll(".autocomplete-box__popup-item");
      var active = element.querySelectorAll(".autocomplete-box__popup-item--active");

      expect(active.length).to.be.equal(1);
      expect(+active[0].getAttribute("data-index")).to.be.equal(1);
    });

    it("should not change active state if the element is the last in the popup", function () {
      autocompleteBox.open();
      autocompleteBox.next();
      autocompleteBox.next();
      autocompleteBox.next();
      autocompleteBox.next();
      autocompleteBox.next();
      autocompleteBox.next();
      autocompleteBox.next();
      autocompleteBox.next();
      autocompleteBox.next();
      autocompleteBox.next();
      autocompleteBox.next();
      autocompleteBox.next();
      autocompleteBox.next();

      var active = element.querySelector(".autocomplete-box__popup-item--active");
      var index = active.getAttribute("data-index");
      expect(+index).to.be.equal(9);
    });


  });

  describe("prev()", function () {
    it("should set active element to previous element", function () {
      autocompleteBox.open();
      autocompleteBox.next();

      var active = element.querySelector(".autocomplete-box__popup-item--active");
      var oldIndex = active.getAttribute("data-index");
      expect(1).to.be.equal(+oldIndex);

      autocompleteBox.next();
      autocompleteBox.prev();
      autocompleteBox.prev();

      active = element.querySelector(".autocomplete-box__popup-item--active");
      var newIndex = active.getAttribute("data-index");
      expect(0).to.be.equal(+newIndex);

    });

    it("should not change active element if no previous element", function () {
      autocompleteBox.open();
      autocompleteBox.prev();
      var active = element.querySelector(".autocomplete-box__popup-item--active");
      var index = active.getAttribute("data-index");
      expect(0).to.be.equal(+index);
    });

    it("should have only one active element after multiply changes next prev", function () {
      autocompleteBox.open();
      autocompleteBox.next();
      autocompleteBox.next();
      autocompleteBox.prev();
      autocompleteBox.next();
      autocompleteBox.prev();

      var active = element.querySelectorAll(".autocomplete-box__popup-item--active");
      expect(active.length).to.be.equal(1);
    });
  });

  describe("setActive(n)", function () {
    it("should set n-th item to active state", function () {
      autocompleteBox.open();
      autocompleteBox.setActive(3);
      var active = element.querySelector(".autocomplete-box__popup-item--active");

      var index = +active.getAttribute("data-index");
      expect(index).to.equal(3);
    });

    it("should not change active element if n is out of number of elements", function () {
      autocompleteBox.open();
      var active = element.querySelector(".autocomplete-box__popup-item--active");
      autocompleteBox.setActive(-1);
      var newActive = element.querySelector(".autocomplete-box__popup-item--active");

      expect(newActive).to.be.equal(active);

    });
  });

  describe("update(list)", function () {
    it("should update element with new list of stings", function () {
      var newList = ["Car", "House", "Plain", "Ship"];

      autocompleteBox.open();

      autocompleteBox.update(newList);

      var parsedList = Array.prototype.slice.call(element.querySelectorAll(".autocomplete-box__popup-item")).map(function (el) {
        return el.innerText;
      });

      expect(parsedList).to.have.all.members(newList);
    });

  });

  describe("select() set input field to active element", function () {
    it("should copy active element text to the input element", function () {
      autocompleteBox.open();

      var activeItem = element.querySelector(".autocomplete-box__popup-item--active");
      autocompleteBox.select();
      var input = element.getElementsByTagName("input")[0];
      var inputVal = input.getAttribute("value");

      expect(inputVal).to.be.equal(activeItem.innerText);

      // ------------------------------------

      autocompleteBox.next();
      autocompleteBox.next();
      autocompleteBox.select();
      var input = element.getElementsByTagName("input")[0];
      var inputVal = input.getAttribute("value");
      var activeItem = element.querySelector(".autocomplete-box__popup-item--active");

      expect(inputVal).to.be.equal(activeItem.innerText);

    });
  });


  describe("getInput()", function() {
    it("should return current input field value", function() {
      autocompleteBox.open();
      autocompleteBox.update(["Mary", "Mother"]);
      var input = autocompleteBox.getInput();
      expect(input).to.equal("Mary");
    });


    it("should return input from typed input ", function() {
      var input = element.getElementsByTagName("input")[0];
      var typedContent = "H";
      autocompleteBox.open();

      input.value = typedContent;

      expect(autocompleteBox.getInput()).to.be.equal(typedContent);
    });
  })

});

