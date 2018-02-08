import React, { Component } from 'react';
import { connect } from 'react-redux';
import EditUserForm from './edit_user_form';
import { createUser } from '../actions/users_actions';

class CreateUser extends Component {
  constructor(state) {
    super(state);
    this.create = this.create.bind(this);
  }

  /* eslint-disable object-curly-newline */
  create({ name, email, password, type }) {
  /* eslint-enable object-curly-newline */
    const { xApiKey } = this.props;
    return this.props.createUser(name, email, password, type, xApiKey);
  }

  render() {
    const title = 'Create a User';

    return (
      <div>
        <EditUserForm
          title={title}
          action={this.create}
          backPath="/users"
          {...this.props}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(mapStateToProps, { createUser })(CreateUser);
