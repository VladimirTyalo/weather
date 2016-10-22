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

    autocompleteBox = new AutocompleteBox(element, list, "//");
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

    it("should init all popup items with 'data-real-param' field", function () {
      var newlist = ["Bolton // england // 11", "two//number//22", "three//number//333"];
      autocompleteBox.open();
      autocompleteBox.update(newlist);
      var expected = ["11", "22", "333"];

      var elements = $(".autocomplete-box__popup-item").map(function (index, el) {
        return el.getAttribute("data-real-param");
      }).toArray();


      expect(expected).to.be.deep.equal(elements);


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

      popups = element.querySelectorAll(".autocomplete-box__popup");

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
      expect(+index).to.be.equal(list.length - 1);
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
      autocompleteBox.prev();
      autocompleteBox.prev();
      autocompleteBox.prev();
      autocompleteBox.prev();
      autocompleteBox.prev();
      autocompleteBox.prev();
      autocompleteBox.prev();
      autocompleteBox.prev();
      var active = element.querySelector(".autocomplete-box__popup-item--active");
      var index = active.getAttribute("data-index");
      expect(0).to.be.equal(0);
    });

    it("should have only one active element after multiply changes next prev", function () {
      autocompleteBox.open();
      autocompleteBox.next();
      autocompleteBox.next();
      autocompleteBox.prev();
      autocompleteBox.next();
      autocompleteBox.prev();
      autocompleteBox.prev();
      autocompleteBox.prev();
      autocompleteBox.prev();
      autocompleteBox.prev();

      var active = element.querySelectorAll(".autocomplete-box__popup-item--active");
      expect(active.length).to.be.equal(1);
    });
  });

  describe("setActive(n)", function () {
    it("should set n-th item to active state", function () {
      autocompleteBox.open();
      autocompleteBox.update(list);

      autocompleteBox.setActive(2);
      var active = element.querySelector(".autocomplete-box__popup-item--active");

      var index = +active.getAttribute("data-index");

      expect(index).to.equal(2);
    });

    it("should not change active element if n is out of number of elements", function () {
      autocompleteBox.open();
      var active = element.querySelector(".autocomplete-box__popup-item--active");
      autocompleteBox.setActive(-1);
      var newActive = element.querySelector(".autocomplete-box__popup-item--active");

      expect(newActive).to.be.equal(active);
    });


    it("should set input property 'data-real-param' to the same property of clicked element ", function () {
      autocompleteBox.open();
      var length = list.length;
      var clickedIndex = (Math.random() * length) ^ 0;
      var popupItems = $(".autocomplete-box__popup-item");

      var activeItem = popupItems[clickedIndex];
      activeItem.setAttribute("data-real-param", "777");
      autocompleteBox.setActive(clickedIndex);

      var activeItemId = $(activeItem).attr("data-real-param");
      var result = $(autocompleteBox.getInputElement()).attr("data-real-param");

      expect(list.length).to.be.above(4);
      expect(result).to.be.equal(activeItemId);
    });

    it("should set active element's value to input filed", function () {
      autocompleteBox.open();
      var newList = ["onw//num//11", "two//num//22", "three//num//33"];
      autocompleteBox.update(newList);
      var items = $(".autocomplete-box__popup-item");

      autocompleteBox.setActive(2);

      var val = items[2].innerText.split("//")[0].trim();

      var inputValue = autocompleteBox.getInputText();
      console.log(inputValue);

      expect(val).to.be.equal(inputValue);

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
      var inputVal = input.value;

      expect(inputVal).to.be.equal(activeItem.innerText);


      autocompleteBox.next();
      autocompleteBox.next();
      autocompleteBox.select();
      input = element.getElementsByTagName("input")[0];
      inputVal = input.value;
      activeItem = element.querySelector(".autocomplete-box__popup-item--active");

      expect(inputVal).to.be.equal(activeItem.innerText);

    });


  });


  describe("getInput()", function () {
    it("should return current input field value", function () {
      autocompleteBox.open();
      autocompleteBox.update(["Mary", "Mother"]);
      autocompleteBox.select();
      var input = autocompleteBox.getInputText();
      expect(input).to.equal("Mary");
    });


    it("should return input from typed input ", function () {
      var input = element.getElementsByTagName("input")[0];
      var typedContent = "H";
      autocompleteBox.open();
      autocompleteBox.select();

      input.value = typedContent;

      expect(autocompleteBox.getInputText()).to.be.equal(typedContent);
    });
  });
});

