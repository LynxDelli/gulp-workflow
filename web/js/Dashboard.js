var React = require("react"),
  Authentication = require('./components/login/requireAuth'),
  auth = require('./components/login/auth');

var Dashboard = React.createClass({displayName: "Dashboard",
  mixins: [ Authentication ],
  render: function () {
    var token = auth.getToken();

    /* jshint ignore:start */
    return (
      <div>
        <Link to="logout"><Translate trKey="template.links.logOut" /></Link>
        <h1>Dashboard</h1>
        <p>You made it!</p>
      </div>
    );
    /* jshint ignore:end */
  }
});

module.exports = Dashboard;