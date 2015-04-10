var React = require("react"),
  Router = require("react-router");

var LostPassword = React.createClass ({
  /* jshint ignore:start */
  render : function () {
    return (
      <div data-component="lostPassword">
        <Router.Link to="login"><Translate trKey='template.links.signIn' /></Router.Link>

        <h1>Forgot password</h1>
        <div>Any password username will work.</div>
      </div>
    );
  }
  /* jshint ignore:end */
});

module.exports = LostPassword;