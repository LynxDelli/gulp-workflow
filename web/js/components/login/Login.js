var React = require("react"),
  bootstrap = require("react-bootstrap"),
  Row = bootstrap.Row,
  Col = bootstrap.Col,
  Input = bootstrap.Input,
  Glyphicon = bootstrap.Glyphicon,
  Button = bootstrap.Button,
  auth = require('./auth'),
  Router = require('react-router')
  Link = Router.Link;

var Login = React.createClass({
  displayName: "Login",

  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function () {
    return {
      error: false,
      errorResponse: {}
    };
  },

  handleSubmit: function (event) {
    event.preventDefault();

    var router = this.context.router,
      nextPath = router.getCurrentQuery().nextPath,
      username = 'admin',
      pass = 'admin';

    auth.login(username, pass, function (authenticated, response) {
      if (authenticated) {
        this.setState({ error: false, errorResponse: {} });
      } else {
        return this.setState({ error: true, errorResponse: response });
      }

      if (nextPath) {
        router.replaceWith(nextPath);
      } else {
        router.replaceWith('/dashboard');
      }
    }.bind(this));
  },

  render: function () {
    var errors = '',
      styleError = '';

    /* jshint ignore:start */
    if (this.state.error) {
      errors = <p className="bg-danger"><Translate trKey={this.state.errorResponse.errorCode} /></p>;
      styleError = 'has-error';
    }

    return (
      <div data-component="login">
        <form className="col-md-4 col-md-offset-4" onSubmit={this.handleSubmit}>
          <Row className="header">
            <Translate trKey='login.title' />
          </Row>
          <Row className={styleError}>
            <Col>
              <Input ref="username" type='text' className='form-control' placeholder="Username" addonBefore={<Glyphicon glyph='user' />} />
            </Col>
          </Row>
          <Row className={styleError}>
            <Col>
              <Input ref="pass" type='password' className='form-control' placeholder="Password" addonBefore={<Glyphicon glyph='lock' />} />
            </Col>
          </Row>
          <Row>
            {errors}
          </Row>
          <Row>
            <Button className="btn-block" type="submit"><Translate trKey='login.btn' /></Button>
          </Row>
          <Row className="footer">
            <Col md={6}>
              <Link to="lostPassword"><Translate trKey='login.lostPassword' /></Link>
            </Col>
          </Row>

        </form>
      </div>
    );
    /* jshint ignore:end */
  }
});

module.exports = Login;