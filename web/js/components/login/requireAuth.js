var React = require("react"),
  auth = require('./auth');

var Authentication = {
  statics: {
    willTransitionTo: function (transition) {
      var nextPath = transition.path,
        forward = {'nextPath' : nextPath};

      if (!auth.loggedIn()) {
        if (nextPath === '/') {
          forward = "";
        }
        transition.redirect('/login', {}, forward);
      }
    }
  }
};

module.exports = Authentication;