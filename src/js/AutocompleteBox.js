"use strict";

// element - DOM wrapper element with  <input type='text'> element in it
// list - array of string names to put into autocomplite popup box;

function AutocompleteBox(element, list) {
  // deep clone of list
  var innerList = JSON.parse(JSON.stringify(list));

  if (!(element instanceof Element)) throw new Error("element is not a DOM elment");
  if (!Array.isArray(innerList)) throw new Error("list is not an array"); // ?? adopt to pseudo arrays

  var input = document.getElementsByTagName("input")[0];

  var POPUP_CLASS = "autocomplete-box__popup";
  var POPUP_ITEM_CLASS = "autocomplete-box__popup-item";
  var POPUP_ITEM_ACTIVE_CLASS = POPUP_ITEM_CLASS + "--active";

  var popup;
  var activeItem;


  function open() {
    var els = element.querySelectorAll("." + POPUP_CLASS);
    if (els.length >= 1) return;


    popup = document.createElement("div");
    popup.classList.add(POPUP_CLASS);
    popup.setAttribute("id", "popup");
    popup.style.height = "11em";
    popup.style["overflow-y"] = "scroll";


    innerList.forEach(function (string, index) {

      var el = document.createElement("div");
      el.setAttribute("data-index", index);
      el.innerText = string;
      el.classList.add(POPUP_ITEM_CLASS);
      if (index == 0) {
        activeItem = el;
        el.classList.add(POPUP_ITEM_ACTIVE_CLASS);
      }
      popup.appendChild(el);
    });

    element.appendChild(popup);
    _select();
  }

  function close() {
    var els = element.querySelectorAll("." + POPUP_CLASS);
    if (els.length == 0) return;

    els[0].parentNode.removeChild(els[0]);
    activeItem = undefined;
    input.setAttribute("value", "");
    input.value = "";
  }

  function next() {
    var current = element.querySelector("." + POPUP_ITEM_ACTIVE_CLASS);

    if (current && current.nextSibling) {
      current.classList.remove(POPUP_ITEM_ACTIVE_CLASS);
      current.nextSibling.classList.add(POPUP_ITEM_ACTIVE_CLASS);
      activeItem = current.nextSibling;
      _select();

      // move scrollbar
      var activeElementBottom = activeItem.getBoundingClientRect().bottom;
      var scrollHeight = current.parentNode.offsetHeight;
      var parentTop = current.parentNode.getBoundingClientRect().top;

      if(activeElementBottom  > parentTop + scrollHeight) {
        current.parentNode.scrollTop += 100;
      }
    }
  }

  function prev() {
    var current = element.querySelector("." + POPUP_ITEM_ACTIVE_CLASS);

    if (current && current.previousSibling) {
      current.classList.remove(POPUP_ITEM_ACTIVE_CLASS);
      current.previousSibling.classList.add(POPUP_ITEM_ACTIVE_CLASS);
      activeItem = current.previousSibling;
      _select();
    }

    // move scrollbar
    var activeElementTop = activeItem.getBoundingClientRect().top;
    var parentTop = current.parentNode.getBoundingClientRect().top;

    if(activeElementTop  < parentTop) {
      current.parentNode.scrollTop -= 100;
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
    _select();
  }

  function update(newList) {
    innerList = JSON.parse(JSON.stringify(newList));
    close();
    open();
  }

  function _select() {
    var activeVal = activeItem.innerText;
    input.setAttribute("value", activeVal);
    input.value = activeVal;
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
    select: _select // TODO remove after testing
  };

  return publicAPI;

}
