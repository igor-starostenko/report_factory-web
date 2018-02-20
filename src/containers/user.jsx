import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { Button, ConfirmModal, UserReportsLineChart } from '../components';
import { getUser, logOut, getUserReports } from '../actions/users_actions';
import styles from './styles/Details.css';
import modalStyles from './styles/Modal.css';

const formatDate = (date, options) => {
  const formatOptions = options || { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', formatOptions);
};

class User extends Component {
  constructor() {
    super();
    this.logOut = this.logOut.bind(this);
  }

  componentDidMount() {
    this.requestUser();
    const { userReports, userId } = this.props;
    if (!_.get(userReports, `data.${userId}`)) {
      this.props.getUserReports(userId, this.props.xApiKey);
    }
  }

  componentDidUpdate() {
    this.requestUser();
  }

  requestUser() {
    const { user, userId } = this.props;
    if (!user.data || _.get(user, 'data.id') !== userId) {
      this.props.getUser(userId, this.props.xApiKey);
    }
  }

  logOut() {
    this.props.logOut(this.props.xApiKey);
    return this.props.history.push('/');
  }

  renderLogout() {
    if (this.props.isCurrent) {
      return (
        <Button
          onClick={this.logOut}
          color="warning"
          fill="true"
          text="Log Out"
        />
      );
    }
    return (<div />);
  }

  renderApiKeyModal() {
    const modalContent = (
      <div className={modalStyles.modalBody}>
        <h5>Your X-API-KEY:</h5>
        <h5 className={modalStyles.modalJumbo}>{this.props.xApiKey}</h5>
      </div>
    );
    if (this.props.isCurrent) {
      return (
        <ConfirmModal
          id="viewApiKey"
          title="Api Key"
          close="Ok"
          content={modalContent}
        />
      );
    }
    return (<div />);
  }

  renderViewApiKey() {
    if (this.props.isCurrent) {
      return (
        <Button
          data-toggle="modal"
          data-target="#viewApiKey"
          id="viewKey"
          color="info"
          fill="true"
          text="View Api Key"
        />
      );
    }
    return (<div />);
  }

  renderDetailsButtons() {
    if (this.props.isAdmin || this.props.isCurrent) {
      const editUserUrl = `/users/${this.props.userId}/edit`;
      return (
        <div className={styles.detailsButtons}>
          <Button
            to={editUserUrl}
            color="primary"
            fill="true"
            text="Edit User"
          />
          {this.renderViewApiKey()}
          {this.renderLogout()}
        </div>
      );
    }
    return (<div />);
  }

  render() {
    const { user, userId, userReports } = this.props;
    if (!user.data || _.get(user, 'data.id') !== userId) {
      return (<div />);
    }

    const { attributes: { name, date } } = user.data;
    const createdAt = new Date(date.created_at);

    const reports = _.get(userReports, `data.${userId}`);

    return (
      <div>
        <Link to="/users">Back to users</Link>
        <div className={styles.detailsContainer}>
          <div className={styles.detailsHeader}>
            <div className={styles.detailsName}>{name}</div>
          </div>
          {this.renderDetailsButtons()}
          <div className={styles.detailsSince}>since {formatDate(createdAt)}</div>
          <div className={styles.detailsContent}>
            <UserReportsLineChart
              userReports={reports}
              error={this.props.userReports.error}
            />
          </div>
        </div>
        {this.renderApiKeyModal()}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  userId: ownProps.match.params.id,
  isAdmin: _.get(state.users.currentUser, 'data.attributes.type') === 'Admin',
  isCurrent: _.get(state.users.currentUser, 'data.id') === ownProps.match.params.id,
  user: state.users.activeUser,
  userReports: state.users.userReports,
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(mapStateToProps, { getUser, logOut, getUserReports })(User);
