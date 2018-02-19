import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import UserReportsLineChart from './user_reports_line_chart';
import ConfirmModal from './confirm_modal';
import { getUser, logOut } from '../actions/users_actions';
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
        <button onClick={this.logOut} className="btn btn-warning btn-fill">
          Log Out
        </button>
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
        <button
          data-toggle="modal"
          data-target="#viewApiKey"
          id="viewKey"
          className="btn btn-info btn-fill"
        >View Api Key
        </button>
      );
    }
    return (<div />);
  }

  renderDetailsButtons() {
    if (this.props.isAdmin || this.props.isCurrent) {
      const editUserUrl = `/users/${this.props.userId}/edit`;
      return (
        <div className={styles.detailsButtons}>
          <Link to={editUserUrl} className="btn btn-primary btn-fill">
            Edit User
          </Link>
          {this.renderViewApiKey()}
          {this.renderLogout()}
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
          </div>
          {this.renderDetailsButtons()}
          <div className={styles.detailsSince}>since {formatDate(createdAt)}</div>
          <div className={styles.detailsContent}>
            <UserReportsLineChart userId={this.props.userId} />
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
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(mapStateToProps, { getUser, logOut })(User);
