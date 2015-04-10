var React = require("react"),
  auth = require('./auth');

var Logout = React.createClass({
  displayName: "Logout",

  componentDidMount: function () {
    auth.logout();
  },

  render: function () {
    /* jshint ignore:start */
    return (
      <div>
        <Link to="login"><Translate trKey="template.links.signIn" /></Link>
        <h1>You are now logged out</h1>
      </div>
    );
    /* jshint ignore:end */
  }
});

module.exports = Logout;