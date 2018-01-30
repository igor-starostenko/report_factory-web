import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { signIn, signInFailure, signInSuccess } from '../actions/users_actions';

class Login extends Component {
  static renderField(field) {
    const { meta: { touched, error } } = field;
    const className = `form-group ${touched && error ? 'has-danger' : ''}`;

    return (
      <div className={className}>
        <label>{field.label}</label>
        <input className="form-control" type="text" {...field.input} />
        <div className="text-help error">
          {touched ? error : ''}
        </div>
      </div>
    );
  }

  onSubmit(values, dispatch) {
    return new Promise((resolve, reject) => {
      dispatch(this.props.signIn(values))
        .then((response) => {
          if (!response.payload.data) {
            dispatch(signInFailure(response.payload));
            reject(response.data); //this is for redux-form itself
          } else {
            dispatch(signInSuccess(response.payload));
            resolve();//this is for redux-form itself
            this.props.history.push('/projects');
          }
        });
     });
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
          <div className="formButtons">
            <Link to="/" className="btn btn-danger">Cancel</Link>
            <button type="submit" className="btn btn-primary">Submit</button>
          </div>
        </form>
      </div>
    );
  }
}

const validate = (values) => {
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
};

const mapStateToProps = state => ({
  users: state.users,
});

export default reduxForm({
  validate,
  form: 'LoginForm',
})(connect(mapStateToProps, { signIn })(Login));
