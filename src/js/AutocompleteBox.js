"use strict";

// element - DOM wrapper element with  <input type='text'> element in it
// list - array of string names to put into autocomplete popup box
// each string name might be separated into 3 parts with lineSplitter (for example "//")
// like "part1 // part2  // part3"
// part1 - goes to <input> tag
// part1 + part2 - goes to autocomplete popup list item (optional)
// part3 - goes to <input> and element item's "data-real-param" attribute and should be
// basically unique ID of some querying data (optional)
// lineSplitter -  separator to split list's string into 3 parts;

function AutocompleteBox(element, list, lineSplitter) {
  // deep clone of list
  var innerList = JSON.parse(JSON.stringify(list));

  if (!(element instanceof Element)) throw new Error("element is not a DOM element");
  if (!Array.isArray(innerList)) throw new Error("list is not an array"); // ?? adopt to pseudo arrays

  var input = document.getElementsByTagName("input")[0];

  var POPUP_CLASS = "autocomplete-box__popup";
  var POPUP_ITEM_CLASS = "autocomplete-box__popup-item";
  var POPUP_ITEM_ACTIVE_CLASS = POPUP_ITEM_CLASS + "--active";

  var popup;
  var activeItem;


  function fillElementWithContent(el, index, string, separator) {
    if (separator != "" && separator != undefined && string.indexOf(separator) >= 0) {
      var cityParams = string.split(separator);
      el.innerText = cityParams[0] + " " + lineSplitter + " " + cityParams[1];
      el.setAttribute("data-real-param", cityParams[2]);
    }
    else {
      el.innerText = string;
    }

    el.classList.add(POPUP_ITEM_CLASS);
    if (index == 0) {
      activeItem = el;
      el.classList.add(POPUP_ITEM_ACTIVE_CLASS);
    }
  }

  function open() {
    var els = element.querySelectorAll("." + POPUP_CLASS);
    if (els.length >= 1) return;
    var listLenght = innerList.length;

    popup = document.createElement("div");
    popup.classList.add(POPUP_CLASS);
    popup.setAttribute("id", "popup");
    popup.style.height = (listLenght < 5) ? listLenght * 3 + "rem" : "15rem";
    popup.style["overflow-y"] = "scroll";


    innerList.forEach(function (string, index) {

      var el = document.createElement("div");
      el.setAttribute("data-index", index);

      fillElementWithContent(el, index, string, lineSplitter);

      popup.appendChild(el);
    });

    element.appendChild(popup);

    $(popup).on("click", popupClickHandler);
  }


  function popupClickHandler(ev) {
    ev.preventDefault();
    var target = ev.target;
    var index = target.getAttribute("data-index");

    if (index == undefined) return;
    setActive(index);
  }

  function close() {
    var els = element.querySelectorAll("." + POPUP_CLASS);
    if (els.length == 0) return;
    var oldInput = input.value;

    if (popup) {
      popup.removeEventListener("click", popupClickHandler);
    }

    els[0].parentNode.removeChild(els[0]);
    activeItem = undefined;
    input.setAttribute("value", "");
    input.value = "";
    input.value = oldInput;
  }

  function setActiveSibling(current, sibling, prevOrNextDomName) {
    current.classList.remove(POPUP_ITEM_ACTIVE_CLASS);
    sibling.classList.add(POPUP_ITEM_ACTIVE_CLASS);
    activeItem = current[prevOrNextDomName];
  }

  function next() {
    var current = element.querySelector("." + POPUP_ITEM_ACTIVE_CLASS);

    if (current && current.nextSibling) {
      setActiveSibling(current, current.nextSibling, "nextSibling");
      select();
      adjustScrollbar(current.parentNode, activeItem);
    }
  }

  function prev() {
    var current = element.querySelector("." + POPUP_ITEM_ACTIVE_CLASS);

    if (current && current.previousSibling) {
      setActiveSibling(current, current.previousSibling, "previousSibling");
      select();
      adjustScrollbar(current.parentNode, activeItem);
    }
  }

  function adjustScrollbar(parent, active) {
    var activeTop = active.getBoundingClientRect().top;
    var activeBottom = active.getBoundingClientRect().bottom;
    var parentTop = parent.getBoundingClientRect().top;
    var parentBottom = parent.getBoundingClientRect().bottom;

    if (activeBottom > parentBottom) {
      parent.scrollTop += activeBottom - parentBottom;
    }

    else if (activeTop <= parentTop) {
      parent.scrollTop += activeTop - parentTop;
    }
  }


  function setActive(index) {
    var elements = element.querySelectorAll("." + POPUP_ITEM_CLASS);

    if (elements.length == 0 || index < 0 || index >= elements.length) return;

    var oldActive = element.querySelector("." + POPUP_ITEM_ACTIVE_CLASS);
    var oldIndex = oldActive.getAttribute("data-index");

    elements[oldIndex].classList.remove(POPUP_ITEM_ACTIVE_CLASS);
    elements[index].classList.add(POPUP_ITEM_ACTIVE_CLASS);
    activeItem = elements[index];

    select();
  }

  function update(newList) {
    var oldInput = input.value;
    close();
    innerList = JSON.parse(JSON.stringify(newList));
    open();
    input.value = oldInput;
  }

  function select() {
    var activeVal = (activeItem)? activeItem.innerText : "";
    var realQueryParameter = activeItem.getAttribute("data-real-param");

    input.setAttribute("value", activeVal);

    if (lineSplitter != "" && lineSplitter != undefined) {
      input.value = activeVal.split(lineSplitter)[0].trim();
    }
    else {
      input.value = activeVal.trim();
    }


    input.focus();
    input.setAttribute("data-real-param", realQueryParameter);
  }

  function getInputText() {
    return input.value;
  }

  function getInputElement() {
    return input;
  }


  var publicAPI = {
    getInputText: getInputText,
    getInputElement: getInputElement,
    open: open,
    close: close,
    next: next,
    prev: prev,
    setActive: setActive,
    update: update,
    select: select
  };

  return publicAPI;

}
