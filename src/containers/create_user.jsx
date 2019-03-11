import React, { Fragment } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import getValue from 'lodash/get';
import EditUserForm from './edit_user_form';
import { createUser } from '../actions/users_actions';

function CreateUser(props) {
  function create(attributes) {
    return props.createUser(attributes, props.xApiKey);
  }

  return (
    <Fragment>
      <Link to="/users">Back to users</Link>
      <EditUserForm
        title="Create a User"
        action={create}
        hasPassword
        isAdmin={props.isAdmin}
        submitText="Create"
        backPath="/users"
        initialValues={{ type: 'Tester' }}
        {...props}
      />
    </Fragment>
  );
}

CreateUser.propTypes = {
  createUser: PropTypes.func.isRequired,
  xApiKey: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isAdmin:
    getValue(state.users.currentUser, 'data.attributes.type') === 'Admin',
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(
  mapStateToProps,
  { createUser },
)(CreateUser);
