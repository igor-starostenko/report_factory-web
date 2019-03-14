import React, { Fragment } from 'react';
import { PropTypes } from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import getValue from 'lodash/get';
import { Button, FormField, FormErrors } from '../components';
import { signIn, signInFailure, signInSuccess } from '../actions/users_actions';

function Login(props) {
  function onSubmit(values, dispatch) {
    return new Promise((resolve, reject) => {
      dispatch(props.signIn(values)).then(response => {
        if (!response.payload.data) {
          dispatch(signInFailure(response.payload));
          reject(response.data); // this is for redux-form itself
        } else {
          dispatch(signInSuccess(response.payload));
          resolve(); // this is for redux-form itself
          props.history.push('/projects');
        }
      });
    });
  }

  const { handleSubmit, currentUser } = props;
  const errors = getValue(currentUser, 'error');

  return (
    <Fragment>
      <h1>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Field
          label="Email"
          name="email"
          placeholder="Enter your email"
          type="text"
          component={FormField}
        />
        <Field
          label="Password"
          name="password"
          placeholder="Enter your password"
          type="password"
          component={FormField}
        />
        <FormErrors errors={errors} />
        <div className="formButtons">
          <Button type="submit" color="primary">
            Login
          </Button>
          <Button to="/">Cancel</Button>
        </div>
      </form>
    </Fragment>
  );
}

Login.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    errors: PropTypes.string,
  }).isRequired,
  signIn: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

const validate = ({ email, password }) => {
  const errors = {};

  if (!email) {
    errors.email = 'Enter User email address.';
  } else if (!/^[^\s@]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email)) {
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
})(
  connect(
    mapStateToProps,
    { signIn },
  )(Login),
);
