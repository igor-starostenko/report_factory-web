import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import GenericForm from '../components/generic_form';
import { signIn, signInFailure, signInSuccess } from '../actions/users_actions';

class Login extends Component {
  onSubmit(values, dispatch) {
    return new Promise((resolve, reject) => {
      dispatch(this.props.signIn(values))
        .then((response) => {
          if (!response.payload.data) {
            dispatch(signInFailure(response.payload));
            reject(response.data); // this is for redux-form itself
          } else {
            dispatch(signInSuccess(response.payload));
            resolve(); // this is for redux-form itself
            this.props.history.push('/projects');
          }
        });
    });
  }

  render() {
    const { handleSubmit, currentUser } = this.props;
    const errors = _.get(currentUser, 'error');

    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          <Field
            label="Email"
            name="email"
            type="text"
            component={GenericForm.renderField}
          />
          <Field
            label="Password"
            name="password"
            type="password"
            component={GenericForm.renderField}
          />
          <ul>{GenericForm.renderErrors(errors)}</ul>
          <div className="formButtons">
            <Link to="/" className="btn btn-danger">Cancel</Link>
            <button type="submit" className="btn btn-primary">Submit</button>
          </div>
        </form>
      </div>
    );
  }
}

const validate = ({ email, password }) => {
  const errors = {};

  if (!email) {
    errors.email = 'Enter your email address.';
  }

  if (!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email)) {
    errors.email = 'Email is not valid.';
  }

  if (!password) {
    errors.categories = 'Enter your password.';
  }

  // If errors is empty, the form is fine to submit
  // If errors has *any* properties, redux form assumes form is invalid
  return errors;
};

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});

export default reduxForm({
  validate,
  form: 'LoginForm',
})(connect(mapStateToProps, { signIn })(Login));
