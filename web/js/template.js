var React = require("react"),
  Router = require("react-router");

var Template = React.createClass({
  displayName: "Template",

  render: function () {
    /* jshint ignore:start */
    return (
      <div>
        <Router.RouteHandler />
      </div>
    );
    /* jshint ignore:end */
  }
});

module.exports = Template;