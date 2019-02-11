import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import EditUserForm from './edit_user_form';
import { createUser } from '../actions/users_actions';

class CreateUser extends Component {
  constructor(state) {
    super(state);
    this.create = this.create.bind(this);
  }

  create(attributes) {
    return this.props.createUser(attributes, this.props.xApiKey);
  }

  render() {
    const title = 'Create a User';

    return (
      <div>
        <Link to="/users">Back to users</Link>
        <EditUserForm
          title={title}
          action={this.create}
          hasPassword="true"
          isAdmin={this.props.isAdmin}
          submitText="Create"
          backPath="/users"
          initialValues={{ type: 'Tester' }}
          {...this.props}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAdmin: _.get(state.users.currentUser, 'data.attributes.type') === 'Admin',
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(
  mapStateToProps,
  { createUser },
)(CreateUser);
