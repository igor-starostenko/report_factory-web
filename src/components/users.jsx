import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { getUsers } from '../actions/users_actions';
import styles from './styles/Users.css';

// const formatDate = (date, options) => {
//   const formatOptions = options || { month: 'short', day: 'numeric', year: 'numeric' };
//   return date.toLocaleDateString('en-US', formatOptions);
// };

class Users extends Component {
  componentDidMount() {
    this.props.getUsers(this.props.xApiKey);
  }

  renderUsers() {
    return _.map(this.props.users.data, (user) => {
      const userName = user.attributes.name;
      const userEmail = user.attributes.email;
      const userType = user.attributes.type;

      let userClassName = 'userTester';
      if (userType === 'Admin') {
        userClassName = 'userAdmin';
      }

      // const { date } = user.attributes;
      // const createdAt = formatDate(new Date(date.created_at));

      const userPath = `/users/${user.id}`;

      return (
        <Link to={userPath} className={`${styles.user} ${styles[userClassName]}`} key={user.id}>
          <div className={styles.userBody}>
            <div className={styles.userTitle}>{userName}</div>
            <div className={styles.userEmail}>{userEmail}</div>
          </div>
        </Link>
      );
    });
  }

  render() {
    if (!this.props.users.data) {
      return (<div className="loading">Loading...</div>);
    }

    return (
      <div>
        <br />
        <h1>Users</h1>
        <div className={styles.usersContainer}>
          {this.renderUsers()}
          <Link to="/users/new" className={`${styles.newUser} ${styles.user}`}>
            <div className={styles.userBody}>
              <div className={styles.newUserTitle}>Create a user</div>
            </div>
          </Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  users: state.users.usersList,
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(mapStateToProps, { getUsers })(Users);
