var React = require('react');
  auth = require('./components/login/auth');

var ReactIntl = require("react-intl");

Translate = require('./components/translate');

var Template = require('./template'),
  Dashboard = require('./Dashboard'),
  Login = require('./components/login/Login'),
  About = require('./About'),
  Logout = require('./components/login/Logout'),
  LostPassword = require('./components/login/LostPassword');

var Router = require('react-router'),
  Route = Router.Route,
  DefaultRoute = Router.DefaultRoute,
  NotFoundRoute = Router.NotFoundRoute;

var NotFound = React.createClass({
  displayName: "NotFound",
  render: function () {
    /* jshint ignore:start */
    return (
      <h2>Not found</h2>
    )
    /* jshint ignore:end */
  }
});

var defaultHandler,
  token = auth.getToken();

if (token && token !== "undefined") {
  defaultHandler = Dashboard;
} else {
  defaultHandler = Login;
}

/* jshint ignore:start */
var routes = (
  <Route handler={Template}>
    <Route name="login" handler={Login} />
    <Route name="logout" handler={Logout} />
    <Route name="about" handler={About} />
    <Route name="dashboard" handler={Dashboard} />
    <Route name="lostPassword" handler={LostPassword} />
    <DefaultRoute handler={defaultHandler} />
    <NotFoundRoute handler={NotFound} />
  </Route>
);
/* jshint ignore:end */

Router.run(routes, function (Handler) {
  /* jshint ignore:start */
  React.render(
    <Handler />, document.getElementById('main')
  );
  /* jshint ignore:end */
});