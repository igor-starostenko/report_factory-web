import React, { useState, useEffect, Fragment } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { submit, reset } from 'redux-form';
import { Button } from 'reactstrap';
import getValue from 'lodash/get';
import pick from 'lodash/pick';
import EditUserForm from './edit_user_form';
import UpdatePasswordForm from './update_password_form';
import { ConfirmModal, Loading } from '../components';
import {
  getUser,
  updateUser,
  deleteUser,
  editUserSuccess,
  editUserFailure,
} from '../actions/users_actions';
import styles from './styles/Details.css';

function UpdatePasswordModal(props) {
  function resetForm() {
    props.dispatch(reset('editPasswordForm'));
    props.toggle();
  }
  const { passwordErrors } = props;
  const submitButton = {
    onClick: () => {
      props.dispatch(submit('editPasswordForm'));
      props.toggle();
    },
    disabled: !!(passwordErrors.password || passwordErrors.confirm),
    type: 'button',
    color: 'warning',
    children: 'Update',
  };

  return (
    <ConfirmModal
      isOpen={props.isOpen}
      toggle={resetForm}
      title="Update Password"
      cancel={{ onClick: resetForm, children: 'Cancel' }}
      submit={submitButton}
    >
      <UpdatePasswordForm
        userId={props.userId}
        xApiKey={props.xApiKey}
        formErrors={passwordErrors}
      />
    </ConfirmModal>
  );
}

UpdatePasswordModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  passwordErrors: PropTypes.shape({
    password: PropTypes.string,
    confirm: PropTypes.string,
  }),
  userId: PropTypes.string.isRequired,
  xApiKey: PropTypes.string.isRequired,
};

UpdatePasswordModal.defaultProps = {
  passwordErrors: {
    password: '',
    confirm: '',
  },
};

function DeleteUserModal(props) {
  const submitButton = {
    onClick: props.handleDelete,
    color: 'danger',
    children: 'Delete',
  };

  return (
    <ConfirmModal
      isOpen={props.isOpen}
      toggle={props.toggle}
      title={`Delete ${props.userName}?`}
      cancel={{ children: 'Cancel' }}
      submit={submitButton}
    >
      <div>
        <p>Are you sure you want to delete {props.userName}?</p>
        <p>This action cannot be reverted!</p>
      </div>
    </ConfirmModal>
  );
}

DeleteUserModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired,
};

function UpdateUser(props) {
  const [isUpdatePasswordModalOpen, setUpdatePasswordModal] = useState(false);
  const [isDeleteUserModalOpen, setDeleteUserModal] = useState(false);

  const {
    dispatch,
    user,
    userId,
    passwordForm,
    isCurrent,
    isAdmin,
    xApiKey,
  } = props;
  const isCurrentUser = user.data && getValue(user, 'data.id') === userId;

  useEffect(() => {
    if (!isCurrentUser) {
      props.getUser(userId, xApiKey);
    }
  }, [userId]);

  function handleDelete() {
    props.deleteUser(userId, xApiKey).then(response => {
      if (response.payload.errors) {
        return dispatch(editUserFailure(response.payload));
      }
      dispatch(editUserSuccess(response.payload));
      return props.history.push('/users');
    });
  }

  function update(attributes) {
    return props.updateUser(userId, attributes, xApiKey);
  }

  function toggleUpdatePasswordModal() {
    setUpdatePasswordModal(!isUpdatePasswordModalOpen);
  }

  function toggleDeleteUserModal() {
    setDeleteUserModal(!isDeleteUserModalOpen);
  }

  if (!isCurrentUser) {
    return <Loading page />;
  }

  const userName = getValue(user, 'data.attributes.name');
  const title = `Edit ${userName}`;
  const backPath = `/users/${userId}`;
  const initialValues = pick(user.data.attributes, ['name', 'email', 'type']);
  const passwordErrors = getValue(passwordForm, 'syncErrors');

  return (
    <Fragment>
      <Link to={backPath}>Back to {userName}</Link>
      <EditUserForm
        title={title}
        action={update}
        isCurrent={isCurrent}
        isAdmin={isAdmin}
        backPath={backPath}
        submitText="Update"
        initialValues={initialValues}
        {...props}
      >
        <div className={styles.detailsButtons}>
          {isCurrent && (
            <Button onClick={toggleUpdatePasswordModal} color="warning">
              Update Password
            </Button>
          )}
          {!isCurrent && isAdmin && (
            <Button color="danger" onClick={toggleDeleteUserModal}>
              Delete User
            </Button>
          )}
        </div>
      </EditUserForm>
      {isCurrent && (
        <UpdatePasswordModal
          isOpen={isUpdatePasswordModalOpen}
          toggle={toggleUpdatePasswordModal}
          dispatch={dispatch}
          passwordErrors={passwordErrors}
          userId={userId}
          xApiKey={xApiKey}
        />
      )}
      {!isCurrent && isAdmin && (
        <DeleteUserModal
          isOpen={isDeleteUserModalOpen}
          toggle={toggleDeleteUserModal}
          handleDelete={handleDelete}
          userName={userName}
        />
      )}
    </Fragment>
  );
}

UpdateUser.propTypes = {
  user: PropTypes.shape({
    data: PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      attributes: PropTypes.shape({
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
      }).isRequired,
    }),
  }).isRequired,
  userId: PropTypes.string.isRequired,
  isCurrent: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  xApiKey: PropTypes.string.isRequired,
  passwordForm: PropTypes.shape({
    syncErrors: PropTypes.object,
    registeredFields: PropTypes.object,
  }),
  getUser: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

UpdateUser.defaultProps = {
  passwordForm: {},
};

const mapDispatchToProps = dispatch => ({
  getUser: (...args) => dispatch(getUser(...args)),
  updateUser: (...args) => dispatch(updateUser(...args)),
  deleteUser: (...args) => dispatch(deleteUser(...args)),
  dispatch,
});

const mapStateToProps = (state, ownProps) => ({
  userId: ownProps.match.params.id,
  isAdmin:
    getValue(state.users.currentUser, 'data.attributes.type') === 'Admin',
  isCurrent:
    getValue(state.users.currentUser, 'data.id') === ownProps.match.params.id,
  user: state.users.activeUser,
  xApiKey: state.users.currentUser.xApiKey,
  passwordForm: state.form.editPasswordForm,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UpdateUser);
