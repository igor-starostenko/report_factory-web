import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';
import { FormField, FormErrors } from '../components';
import { updateUser, editUserSuccess, editUserFailure,
  resetEditUser } from '../actions/users_actions';

const update = (values, dispatch, { userId, xApiKey, reset }) => {
  dispatch(updateUser(userId, _.pick(values, 'password'), xApiKey))
    .then((response) => {
      reset();
      if (!response.payload.data) {
        return dispatch(editUserFailure(response.payload));
      }
      return dispatch(editUserSuccess(response.payload));
    });
};

class UpdatePasswordForm extends Component {
  componentWillUnmount() {
    this.props.resetMe();
  }

  render() {
    const errors = _.get(this.props.editUser, 'error');

    return (
      <form onSubmit={this.props.handleSubmit}>
        <Field
          label="New Password"
          name="password"
          type="password"
          component={FormField}
        />
        <Field
          label="Confirm Password"
          name="confirm"
          type="password"
          component={FormField}
        />
        <FormErrors errors={errors} />
      </form>
    );
  }
}

const validate = ({ password, confirm }) => {
  const errors = {};

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.password = 'Password needs to have at least one upper case letter.';
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.password = 'Password needs to have at least one lower case letter.';
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.password = 'Password needs to have at least one digit.';
  }

  if (!/[^.]{8,105}$/.test(password)) {
    errors.password = 'Password must be between 8 and 105 characters long.';
  }

  if (password !== confirm) {
    errors.confirm = 'Password doesn\'t match. Please try again.';
  }

  // If errors is empty, the form is fine to submit
  // If errors has *any* properties, redux form assumes form is invalid
  return errors;
};

const mapDispatchToProps = dispatch => ({
  resetMe: () => dispatch(resetEditUser()),
  dispatch,
});

const mapStateToProps = state => ({
  editUser: state.users.editUser,
});

export default reduxForm({
  validate,
  form: 'editPasswordForm',
  onSubmit: update,
})(connect(mapStateToProps, mapDispatchToProps)(UpdatePasswordForm));
