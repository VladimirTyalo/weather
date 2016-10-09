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

      var cityParams = string.split("//");

      el.innerText = cityParams[0] + " | " + cityParams[1];
      el.setAttribute("data-real-param", cityParams[2]);
      el.classList.add(POPUP_ITEM_CLASS);
      if (index == 0) {
        activeItem = el;
        el.classList.add(POPUP_ITEM_ACTIVE_CLASS);
      }
      popup.appendChild(el);
    });

    element.appendChild(popup);

    popup.addEventListener("click", popupClickHandler);
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
    input.setAttribute("data-real-param", undefined);
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
    innerList = JSON.parse(JSON.stringify(newList));
    close();
    open();
    input.value = oldInput;
  }

  function select() {
    var activeVal = activeItem.innerText;
    var realQueryParameter = activeItem.getAttribute("data-real-param");

    input.setAttribute("value", activeVal);
    input.value = activeVal.split("//")[0].trim();
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