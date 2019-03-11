import React, { useEffect, Fragment } from 'react';
import { PropTypes } from 'prop-types';
import { Field, Form, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import getValue from 'lodash/get';
import { FormField, FormRadio, FormErrors, Button } from '../components';
import {
  editUserSuccess,
  editUserFailure,
  resetEditUser,
} from '../actions/users_actions';
import styles from './styles/Details.css';

function EditUserForm(props) {
  const {
    isAdmin,
    isCurrent,
    handleSubmit,
    title,
    backPath,
    errors,
    hasPassword,
    children,
    submitText,
  } = props;

  // resets on componentWillUnmount()
  useEffect(() => () => props.resetMe());

  function onSubmit(values, dispatch) {
    props.action(values).then(response => {
      if (!response.payload.data) {
        return dispatch(editUserFailure(response.payload));
      }
      dispatch(editUserSuccess(response.payload));
      return props.history.push('/users');
    });
  }

  return (
    <div className={styles.detailsContainer}>
      <div className={styles.detailsHeader}>
        <div className={styles.detailsName}>{title}</div>
      </div>
      {children}
      <Form className={styles.detailsContent} onSubmit={handleSubmit(onSubmit)}>
        <Field
          label="User Name"
          name="name"
          placeholder="Enter User name"
          component={FormField}
        />
        <Field
          label="Email"
          name="email"
          placeholder="Enter User email"
          component={FormField}
        />
        {hasPassword && (
          <Field
            label="Password"
            name="password"
            placeholder="Enter User password"
            type="password"
            component={FormField}
          />
        )}
        {(isAdmin || !isCurrent) && (
          <Fragment>
            <Field
              name="type"
              options={[{ value: 'Tester' }, { value: 'Admin' }]}
              component={FormRadio}
            />
          </Fragment>
        )}
        <FormErrors errors={errors} />
        <div className="formButtons">
          <Button type="submit" color="primary">
            {submitText}
          </Button>
          <Button to={backPath}>Cancel</Button>
        </div>
      </Form>
    </div>
  );
}

EditUserForm.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  isCurrent: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  backPath: PropTypes.string.isRequired,
  errors: PropTypes.arrayOf(PropTypes.string),
  hasPassword: PropTypes.bool,
  children: PropTypes.element.isRequired,
  submitText: PropTypes.string.isRequired,
  resetMe: PropTypes.func.isRequired,
  action: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

EditUserForm.defaultProps = {
  hasPassword: false,
  errors: [],
};

/* eslint-disable-next-line object-curly-newline */
const validate = ({ name, email, password, type }) => {
  const errors = {};

  if (!name) {
    errors.name = "User Name can't be blank";
  }

  if (!/\w{3,11}$/.test(name)) {
    errors.name = 'User Name has to be between 3 and 11 characters long.';
  }

  if (/[^a-zA-Z0-9]/.test(name)) {
    errors.name = 'User Name can only have letters or numbers.';
  }

  if (!email) {
    errors.email = 'Enter User email address.';
  } else if (!/^[^\s@]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email)) {
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
    errors.type = "Please select user's level of permissions.";
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
  editUser: getValue(state.users.editUser, 'error'),
});

export default reduxForm({
  validate,
  form: 'editUserForm',
})(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(EditUserForm),
);
