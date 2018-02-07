import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import UserReportsLineChart from './user_reports_line_chart';
import { authUser, logOut } from '../actions/users_actions';
import styles from './styles/Details.css';

const formatDate = (date, options) => {
  const formatOptions = options || { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', formatOptions);
};

class MyProfile extends Component {
  constructor() {
    super();
    this.logOut = this.logOut.bind(this);
  }

  componentDidMount() {
    if (!this.props.user.data) {
      const { xApiKey } = this.props;
      this.props.authUser(xApiKey);
    }
  }

  logOut() {
    this.props.logOut(this.props.xApiKey);
    return this.props.history.push('/');
  }

  render() {
    if (!this.props.user.data) {
      return (<div className="loading">Loading...</div>);
    }

    const userId = this.props.user.data.id;
    const { name, date } = this.props.user.data.attributes;
    const createdAt = new Date(date.created_at);
    const editUserUrl = `users/${userId}/edit`;

    return (
      <div>
        <Link to="/users">Back to users</Link>
        <div className={styles.detailsContainer}>
          <div className={styles.detailsHeader}>
            <div className={styles.detailsName}>{name}</div>
            <div className={styles.detailsSince}>since {formatDate(createdAt)}</div>
          </div>
          <div className={`${styles.detailsButton} ${styles.viewDetails}`}>
            <Link to={editUserUrl} className="btn btn-primary btn-fill">
              Edit User
            </Link>
          </div>
          <div className={`${styles.detailsButton} ${styles.actionButton}`}>
            <button onClick={this.logOut} className="btn btn-warning btn-fill">
              Log Out
            </button>
          </div>
          <div className={styles.chart}>
            <UserReportsLineChart userId={userId} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.users.currentUser,
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(mapStateToProps, { authUser, logOut })(MyProfile);
