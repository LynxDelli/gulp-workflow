var React = require("react"),
  ReactIntl = require("react-intl");

var intlData = require('./../../language/en-US.json');

var TranslateHelper = React.createClass({
  mixins: [ReactIntl.IntlMixin],
  render: function () {
    if (this.props.trKey) {
      var trKey = this.props.trKey,
        validateKey = true,
        pathParts = trKey.split('.'),
        message;

      message = pathParts.reduce(function (obj, pathPart) {
        if (typeof obj[pathPart] === 'undefined') {
          validateKey = false;
          return false;
        } else {
          return obj[pathPart];
        }
      }, this.props.messages);

      if (validateKey) {
        /* jshint ignore:start */
        return (
          <ReactIntl.FormattedMessage message={this.getIntlMessage(this.props.trKey)} />
        );
        /* jshint ignore:end */
      } else {
        /* jshint ignore:start */
        return (
          <span>!!notFound: {this.props.trKey}!!</span>
        );
        /* jshint ignore:end */
      }
    } else {
      return <span>!!noKey!!</span>
    }
  }
});

var Translate = React.createClass ({
  render : function () {
    /* jshint ignore:start */
    return (
        <TranslateHelper trKey={this.props.trKey} {...intlData} />
    );
    /* jshint ignore:end */
  }
});

module.exports = Translate;