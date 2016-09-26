"use strict";
var $ = window.jQuery;

function Location() {
  this._locationServicePorvider = "http://ipinfo.io";
}

Location.prototype = {
  getLocationByIP: function() {
    return Promise.resolve($.getJSON(this._locationServicePorvider, function (data) {}));
  }
};
