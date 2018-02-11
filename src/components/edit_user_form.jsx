import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import GenericForm from './generic_form';
import { editUserSuccess, editUserFailure,
  resetEditUser } from '../actions/users_actions';

class EditUserForm extends Component {
  componentWillUnmount() {
    this.props.resetMe();
  }

  onSubmit(values, dispatch) {
    this.props.action(values)
      .then((response) => {
        if (!response.payload.data) {
          return dispatch(editUserFailure(response.payload));
        }
        dispatch(editUserSuccess(response.payload));
        return this.props.history.push('/users');
      });
  }

  renderSideButton() {
    if (this.props.sideButton) {
      return this.props.sideButton();
    }
    return (<div />);
  }

  renderPassword() {
    if (this.props.hasPassword) {
      return (
        <Field
          label="Password"
          name="password"
          type="password"
          component={GenericForm.renderField}
        />
      );
    }
    return (<div />);
  }

  renderType() {
    if (this.props.isAdmin) {
      return (
        <div>
          <Field
            name="type"
            options={[{ value: 'Tester' }]}
            component={GenericForm.renderRadio}
          />
          <Field
            name="type"
            options={[{ value: 'Admin' }]}
            component={GenericForm.renderRadio}
          />
        </div>
      );
    }
    return (<div />);
  }

  render() {
    /* eslint-disable object-curly-newline */
    const { handleSubmit, title, backPath, editUser } = this.props;
    /* eslint-enable object-curly-newline */
    const errors = _.get(editUser, 'error');

    /* eslint-disable react/jsx-no-bind */
    return (
      <div>
        <div className="formHeader">
          <h1>{title}</h1>
          {this.renderSideButton()}
        </div>
        <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          <Field
            label="User Name"
            name="name"
            component={GenericForm.renderField}
          />
          <Field
            label="Email"
            name="email"
            component={GenericForm.renderField}
          />
          {this.renderPassword()}
          {this.renderType()}
          <ul>{GenericForm.renderErrors(errors)}</ul>
          <div className="formButtons">
            <button type="submit" className="btn btn-primary">Submit</button>
            <Link to={backPath} className="btn btn-danger">Cancel</Link>
          </div>
        </form>
        {this.renderSideButton()}
      </div>
    );
    /* eslint-enable react/jsx-no-bind */
  }
}

/* eslint-disable object-curly-newline */
const validate = ({ name, email, password, type }) => {
/* eslint-enable object-curly-newline */
  const errors = {};

  if (!name) {
    errors.name = 'Enter User Name.';
  }

  if (!/\w{3,11}$/.test(name)) {
    errors.name = 'User Name has to be between 3 and 11 characters long.';
  }

  if (/[^a-zA-Z0-9]/.test(name)) {
    errors.name = 'User Name can only have letters or numbers.';
  }

  if (!email) {
    errors.email = 'Enter User email address.';
  } else if (!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email)) {
    errors.email = 'Email is not valid.';
  }

  if (!/\w{8,105}$/.test(password)) {
    errors.password = 'Password must be between 8 and 105 characters long.';
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.password = 'Password needs to have at least one lower case letter.';
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.password = 'Password needs to have at least one upper case letter.';
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.password = 'Password needs to have at least one digit.';
  }

  if (!type) {
    errors.type = 'Please select user\'s level of permissions.';
  }

  // If errors is empty, the form is fine to submit
  // If errors has *any* properties, redux form assumes form is invalid
  return errors;
};

const mapDispatchToProps = dispatch => ({
  resetMe: () => dispatch(resetEditUser()),
});

const mapStateToProps = (state, ownProps) => ({
  userId: ownProps.match.params.id,
  editUser: state.users.editUser,
});

export default reduxForm({
  validate,
  form: 'editUserForm',
})(connect(mapStateToProps, mapDispatchToProps)(EditUserForm));
