var language = {
  init: function () {
    if (this.get() === null) {
      this.set('en-US');
    }

    makeRequest(this.get(), function (res) {
      intlData = res;
    }.bind(this));
  },

  set: function (lang) {
    localStorage.setItem("lang", lang);
  },

  get: function () {
    return localStorage.getItem("lang");
  }
};

var $ = jQuery = require('jquery');

function makeRequest (lang, cb) {
  $.ajax({
    url: "/language/" + lang + ".json",
    method: "GET",
    contentType:"application/json; charset=utf-8",
    dataType: "json",
    success: function (response) {
      cb(response);
    }
  });
}

module.exports = language;