import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { submit } from 'redux-form';
import _ from 'lodash';
import EditUserForm from './edit_user_form';
import UpdatePasswordForm from './update_password_form';
import { Button, ConfirmModal } from '../components';
import { getUser, updateUser, deleteUser, editUserSuccess, editUserFailure } from '../actions/users_actions';
import styles from './styles/Details.css';

class UpdateUser extends Component {
  constructor(state) {
    super(state);
    this.update = this.update.bind(this);
    this.sideButton = this.sideButton.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    const { user, userId } = this.props;
    if (!user.data || _.get(user, 'data.id') !== userId) {
      this.props.getUser(userId, this.props.xApiKey);
    }
  }

  handleDelete() {
    const { dispatch, userId, xApiKey } = this.props;
    this.props.deleteUser(userId, xApiKey)
      .then((response) => {
        if (response.payload.errors) {
          return dispatch(editUserFailure(response.payload));
        }
        dispatch(editUserSuccess(response.payload));
        return this.props.history.push('/users');
      });
  }

  sideButton() {
    if (this.props.isCurrent) {
      return this.updatePasswordButton();
    } else if (this.props.isAdmin) {
      return this.deleteButton();
    }
    return (<div />);
  }

  updatePasswordButton() {
    const title = 'Update Password';
    const content = (
      <UpdatePasswordForm
        userId={this.props.userId}
        xApiKey={this.props.xApiKey}
      />);
    const submitButton = {
      onClick: () => this.props.dispatch(submit('editPasswordForm')),
      type: 'submit',
    };

    return (
      <div className={styles.detailsButtons}>
        <Button
          data-toggle="modal"
          data-target="#updatePasswordModal"
          id="update"
          color="warning"
          fill="true"
          text="Update Password"
        />
        <ConfirmModal
          id="updatePasswordModal"
          title={title}
          content={content}
          close="Cancel"
          confirm="Update"
          submit={submitButton}
        />
      </div>
    );
  }

  deleteButton() {
    const title = `Delete ${this.props.userName}?`;
    const content = (
      <div>
        <p>Are you sure you want to delete {this.props.userName}?</p>
        <p>This action cannot be reverted!</p>
      </div>
    );

    return (
      <div className={styles.detailsButtons}>
        <Button
          data-toggle="modal"
          data-target="#deleteModal"
          id="delete"
          color="danger"
          fill="true"
          text="Delete User"
        />
        <ConfirmModal
          id="deleteModal"
          title={title}
          content={content}
          close="Cancel"
          confirm="Delete"
          submit={{ onClick: this.handleDelete }}
        />
      </div>
    );
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
    const initialValues = _.pick(user.data.attributes, ['name', 'email', 'type']);

    return (
      <div>
        <Link to={backPath}>Back to {userName}</Link>
        <EditUserForm
          title={title}
          action={this.update}
          sideButton={this.sideButton}
          isCurrent={this.props.isCurrent}
          isAdmin={this.props.isAdmin}
          backPath={backPath}
          submitText="Update"
          initialValues={initialValues}
          {...this.props}
        />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  getUser: (...args) => dispatch(getUser(...args)),
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
