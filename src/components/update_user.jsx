import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import EditUserForm from './edit_user_form';
import { getUser, updateUser, deleteUser, editUserSuccess, editUserFailure } from '../actions/users_actions';

class UpdateUser extends Component {
  constructor(state) {
    super(state);
    this.update = this.update.bind(this);
    this.deleteButton = this.deleteButton.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    const { user, userId } = this.props;
    if (!user.data || _.get(user, 'data.id') !== userId) {
      this.props.getUser(userId, this.props.xApiKey);
    }
  }

  /* eslint-disable consistent-return */
  handleDelete() {
    /* eslint-disable object-curly-newline */
    const { dispatch, userId, userName, xApiKey } = this.props;
    /* eslint-enable object-curly-newline */

    /* eslint-disable no-restricted-globals */
    /* eslint-disable no-alert */
    /* eslint-disable no-undef */
    if (confirm(`Are you sure you want to delete "${userName}" user?`)) {
    /* eslint-enable no-restricted-globals */
    /* eslint-enable no-alert */
    /* eslint-enable no-undef */
      this.props.deleteUser(userId, xApiKey)
        .then((response) => {
          if (response.payload.errors) {
            return dispatch(editUserFailure(response.payload));
          }
          dispatch(editUserSuccess(response.payload));
          return this.props.history.push('/users');
        });
    }
  }
  /* eslint-enable consistent-return */

  deleteButton() {
    if (this.props.isAdmin && !this.props.isCurrent) {
      return (
        <div>
          <button
            onClick={this.handleDelete}
            id="delete"
            className="btn btn-danger btn-fill"
          >Delete User
          </button>
        </div>
      );
    }
    return (<div />);
  }

  update(attributes) {
    const { userId, xApiKey } = this.props;
    return this.props.updateUser(userId, attributes, xApiKey);
  }

  render() {
    const { user, userId, userName } = this.props;
    if (!user.data || _.get(user, 'data.id') !== userId) {
      return (<div className="loading">Loading...</div>);
    }

    const title = `Edit ${userName}`;
    const backPath = `/users/${userId}`;

    const initialValues = user.data.attributes;

    return (
      <div>
        <Link to={backPath}>Back to {userName}</Link>
        <EditUserForm
          title={title}
          action={this.update}
          sideButton={this.deleteButton}
          isAdmin={this.props.isAdmin}
          backPath={backPath}
          initialValues={initialValues}
          {...this.props}
        />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  getUser: (...args) => dispatch(updateUser(...args)),
  updateUser: (...args) => dispatch(updateUser(...args)),
  deleteUser: (...args) => dispatch(deleteUser(...args)),
  dispatch,
});

const mapStateToProps = (state, ownProps) => ({
  userId: ownProps.match.params.id,
  isAdmin: _.get(state.users.currentUser, 'data.attributes.type') === 'Admin',
  isCurrent: _.get(state.users.currentUser, 'data.id') === ownProps.match.params.id,
  user: state.users.activeUser,
  userName: _.get(state.users.activeUser, 'data.attributes.name'),
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateUser);
