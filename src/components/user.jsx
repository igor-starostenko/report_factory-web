import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import UserReportsLineChart from './user_reports_line_chart';
import { getUser } from '../actions/users_actions';
import styles from './styles/Details.css';

const formatDate = (date, options) => {
  const formatOptions = options || { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', formatOptions);
};

class User extends Component {
  componentDidMount() {
    const { user, userId } = this.props;
    if (!user.data || _.get(user, 'data.id') !== userId) {
      this.props.getUser(userId, this.props.xApiKey);
    }
  }

  renderEdit() {
    if (this.props.isAdmin) {
      const editUserUrl = `/users/${this.props.userId}/edit`;
      return (
        <div className={styles.detailsButtons}>
          <Link to={editUserUrl} className="btn btn-warning btn-fill">
            Edit User
          </Link>
        </div>
      );
    }
    return (<div />);
  }

  render() {
    const { user, userId } = this.props;
    if (!user.data || _.get(user, 'data.id') !== userId) {
      return (<div className="loading">Loading...</div>);
    }

    const { attributes: { name, date } } = user.data;
    const createdAt = new Date(date.created_at);

    return (
      <div>
        <Link to="/users">Back to users</Link>
        <div className={styles.detailsContainer}>
          <div className={styles.detailsHeader}>
            <div className={styles.detailsName}>{name}</div>
            <div className={styles.detailsSince}>since {formatDate(createdAt)}</div>
          </div>
          {this.renderEdit()}
          <div className={styles.chart}>
            <UserReportsLineChart userId={this.props.userId} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  userId: ownProps.match.params.id,
  isAdmin: _.get(state.users.currentUser, 'data.attributes.type') === 'Admin',
  user: state.users.activeUser,
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(mapStateToProps, { getUser })(User);
