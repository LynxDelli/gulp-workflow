var auth = {
  login: function (email, pass, cb) {
    cb = arguments[arguments.length - 1];
    if (this.getToken()) {
      if (cb) {
        cb(true);
      }
      this.onChange(true);
      return;
    }
    makeRequest(email, pass, function (res) {
      if (res.authenticated) {
        this.setToken(res.token);
        if (cb) {
          cb(true, res);
        }
        this.onChange(true);
      } else {
        if (cb) {
          cb(false, res);
        }
        this.onChange(false);
      }
    }.bind(this));
  },

  getToken: function () {
    return localStorage.token;
  },

  setToken: function (token) {
    localStorage.token = token;
  },


  logout: function (cb) {
    delete localStorage.token;
    if (cb) {
      cb();
    }
    this.onChange(false);
  },

  loggedIn: function () {
    return !!localStorage.token;
  },

  onChange: function () {}
};

function makeRequest (username, pass, cb) {
  if ((username === "" && pass === "") || (typeof username === "undefined" && typeof pass === "undefined")) {
    cb({authenticated: false, errorCode: "error.allRequired"});
  } else {
    if (username === 'admin' && pass === 'admin') {
      cb({
        error: false,
        authenticated: true,
        token: 'SampleToken'
      });
    } else {
      cb({
        error: true,
        authenticated: false,
        message: '',
        errorCode: ''
      });
    }
  }
}

module.exports = auth;