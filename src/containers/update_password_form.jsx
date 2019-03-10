import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Form, Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import getValue from 'lodash/get';
import pick from 'lodash/pick';
import { FormField, FormErrors, } from '../components';
import {
  updateUser,
  editUserSuccess,
  editUserFailure,
  resetEditUser,
} from '../actions/users_actions';

const update = (values, dispatch, { userId, xApiKey, reset }) => {
  dispatch(updateUser(userId, pick(values, 'password'), xApiKey)).then(
    response => {
      reset();
      if (!response.payload.data) {
        return dispatch(editUserFailure(response.payload));
      }
      return dispatch(editUserSuccess(response.payload));
    },
  );
};

class UpdatePasswordForm extends Component {
  componentWillUnmount() {
    this.props.resetMe();
  }

  render() {
    const { editUser, handleSubmit } = this.props;
    const errors = getValue(editUser, 'error');

    return (
      <Form onSubmit={handleSubmit}>
        <Field
          props={{
            placeholder: 'New Password',
            type: 'password',
            id: 'password',
            label: 'Password',
          }}
          name="password"
          component={FormField}
        />
        <Field
          props={{
            placeholder: 'Confirm Password',
            type: 'password',
            id: 'confirm',
            label: 'Confirm Password',
          }}
          name="confirm"
          component={FormField}
        />
        <FormErrors errors={errors} />
      </Form>
    );
  }
}

UpdatePasswordForm.propTypes = {
  resetMe: PropTypes.func.isRequired,
  editUser: PropTypes.shape({
    data: PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      attributes: PropTypes.shape({
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
      }).isRequired,
    }),
    error: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  resetMe: () => dispatch(resetEditUser()),
  dispatch,
});

const validate = ({ password, confirm }) => {
  const errors = {};

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.password = 'Password has to have at least one upper case letter.';
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.password = 'Password has to have at least one lower case letter.';
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.password = 'Password has to have at least one digit.';
  }

  if (!/[^.]{8,105}$/.test(password)) {
    errors.password = 'Password need to be between 8 and 105 characters long.';
  }

  if (password !== confirm) {
    errors.confirm = "Password doesn't match. Please try again.";
  }

  // If errors is empty, the form is fine to submit
  // If errors has *any* properties, redux form assumes form is invalid
  return errors;
};

const mapStateToProps = state => ({
  editUser: state.users.editUser,
});

export default reduxForm({
  validate,
  form: 'editPasswordForm',
  onSubmit: update,
})(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(UpdatePasswordForm),
);
