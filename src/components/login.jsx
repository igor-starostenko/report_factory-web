import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { signIn } from '../actions';

class Login extends Component {
  static renderField(field) {
    const { meta: { touched, error } } = field;
    const className = `form-group ${touched && error ? 'has-danger' : ''}`;

    return (
      <div className={className}>
        <label>{field.label}</label>
        <input className="form-control" type="text" {...field.input} />
        <div className="text-help">
          {touched ? error : ''}
        </div>
      </div>
    );
  }

  onSubmit(values) {
    this.props.signIn(values)
      .then(response => this.saveSession(response))
      .then(this.props.history.push('/projects'));
  }

  saveSession(user) {
    const { cookies } = this.props;
    const xApiKey = user.payload.data.attributes.api_key;
    cookies.set('X-API-KEY', xApiKey, { path: '/' });
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          <Field
            label="Email"
            name="email"
            component={Login.renderField}
          />
          <Field
            label="Password"
            name="password"
            component={Login.renderField}
          />
          <button type="submit" className="btn btn-primary">Submit</button>
          <Link to="/" className="btn btn-danger">Cancel</Link>
        </form>
      </div>
    );
  }
}

function validate(values) {
  const errors = {};

  if (!values.email) {
    errors.email = 'Enter your email';
  }
  if (!values.password) {
    errors.categories = 'Enter your password';
  }

  // If errors is empty, the form is fine to submit
  // If errors has *any* properties, redux form assumes form is invalid
  return errors;
}

function mapStateToProps(state) {
  return { users: state.users };
}

export default reduxForm({
  validate,
  form: 'LoginForm',
})(connect(mapStateToProps, { signIn })(withCookies(Login)));
