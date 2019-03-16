import React, { Fragment, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import getValue from 'lodash/get';
import map from 'lodash/map';
import { Loading } from '../components';
import { getUsers } from '../actions/users_actions';
import styles from './styles/Users.css';

function UserListItem(props) {
  const { name, email, type, id } = props;
  const className = type === 'Admin' ? 'userAdmin' : 'userTester';

  return (
    <Link
      to={`/users/${id}`}
      className={`${styles.user}
      ${styles[className]}`}
    >
      <div className={styles.userBody}>
        <div className={styles.userTitle}>{name}</div>
        <div className={styles.userEmail}>{email}</div>
      </div>
    </Link>
  );
}

UserListItem.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

function Users(props) {
  const { xApiKey, users, isAdmin } = props;

  useEffect(() => {
    props.getUsers(xApiKey);
  }, []);

  if (!users.data) {
    return <Loading />;
  }

  return (
    <Fragment>
      <br />
      <h1>Users</h1>
      <div className={styles.usersContainer}>
        {map(users.data, ({ id, attributes }) => (
          <UserListItem
            name={attributes.name}
            email={attributes.email}
            type={attributes.type}
            id={id}
            key={id}
          />
        ))}
        {isAdmin && (
          <Link to="/users/new" className={`${styles.newUser} ${styles.user}`}>
            <div className={styles.userBody}>
              <div className={styles.newUserTitle}>Create a user</div>
            </div>
          </Link>
        )}
      </div>
    </Fragment>
  );
}

Users.propTypes = {
  xApiKey: PropTypes.string.isRequired,
  users: PropTypes.shape({
    data: PropTypes.shape({
      id: PropTypes.string,
      attributes: PropTypes.shape({
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
      }),
    }),
  }).isRequired,
  isAdmin: PropTypes.bool.isRequired,
  getUsers: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  users: state.users.usersList,
  isAdmin:
    getValue(state.users.currentUser, 'data.attributes.type') === 'Admin',
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(
  mapStateToProps,
  { getUsers },
)(Users);
