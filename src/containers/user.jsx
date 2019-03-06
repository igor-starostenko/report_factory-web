import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import getValue from 'lodash/get';
import { Button, ConfirmModal, UserReportsLineChart } from '../components';
import {
  getUser,
  logOut,
  setUserReportsFilters,
  queryUserReports,
} from '../actions/users_actions';
import { formatTotalReports } from '../helpers/format_helpers';
import styles from './styles/Details.css';
import modalStyles from './styles/Modal.css';

const ViewApiKeyButton = props => (
  <Button
    data-toggle="modal"
    data-target="#viewApiKey"
    id="viewKey"
    color="info"
    fill="true"
    text="View Api Key"
    {...props}
  />
);

const LogOutButton = props => (
  <Button color="warning" fill="true" text="Log Out" {...props} />
);

const DetailsButtons = props => {
  const { userId, isCurrent, onLogOut } = props;
  return (
    <div className={styles.detailsButtons}>
      <Button
        to={`/users/${userId}/edit`}
        color="primary"
        fill="true"
        text="Edit User"
      />
      {isCurrent && <ViewApiKeyButton />}
      {isCurrent && <LogOutButton onClick={onLogOut} />}
    </div>
  );
};

const ModalContent = props => (
  <div className={modalStyles.modalBody}>
    <h5>Your X-API-KEY:</h5>
    <h5 className={modalStyles.modalJumbo}>{props.xApiKey}</h5>
  </div>
);

const ApiKeyModal = props => (
  <ConfirmModal id="viewApiKey" title="Api Key" cancelText="Ok">
    <ModalContent xApiKey={props.xApiKey} />
  </ConfirmModal>
);

class User extends Component {
  constructor() {
    super();
    this.logOut = this.logOut.bind(this);
    this.queryUserReports = this.queryUserReports.bind(this);
  }

  componentDidMount() {
    this.requestUser();
    const { userReports, userId } = this.props;
    if (!getValue(userReports, userId)) {
      this.queryUserReports(this.getFilters());
    }
  }

  componentDidUpdate() {
    this.requestUser();
  }

  getFilters() {
    const { filters, userId } = this.props;
    if (!filters[userId]) {
      return { filterName: 'Week', lastDays: 8 };
    }
    return filters[userId];
  }

  requestUser() {
    const { user, userId } = this.props;
    if (!user.data || getValue(user, 'data.id') !== userId) {
      this.props.getUser(userId, this.props.xApiKey);
    }
  }

  queryUserReports({ filterName, lastDays, lastMonths }) {
    const { userId, xApiKey } = this.props;
    this.props.setUserReportsFilters(userId, {
      filterName,
      lastDays,
      lastMonths,
    });
    this.props.queryUserReports(xApiKey, { userId, lastDays, lastMonths });
  }

  logOut() {
    this.props.logOut(this.props.xApiKey);
    return this.props.history.push('/');
  }

  render() {
    const { user, userId, userReports, isAdmin, isCurrent } = this.props;
    if (!user.data || getValue(user, 'data.id') !== userId) {
      return <div />;
    }

    const { name } = user.data.attributes;
    const { reports, reportsCount } = getValue(userReports, userId) || {};
    const totalCountText = formatTotalReports(reportsCount);

    return (
      <Fragment>
        <Link to="/users">Back to users</Link>
        <div className={styles.detailsContainer}>
          <div className={styles.detailsHeader}>
            <h1 className={styles.detailsName}>{name}</h1>
          </div>
          {(isAdmin || isCurrent) && (
            <DetailsButtons
              userId={userId}
              isCurrent={isCurrent}
              onLogOut={this.logOut}
            />
          )}
          <div className={styles.detailsTotal}>{totalCountText}</div>
          <div className={styles.detailsContent}>
            <UserReportsLineChart
              filterAction={this.queryUserReports}
              filters={this.getFilters()}
              totalCount={reportsCount}
              userReports={reports}
            />
          </div>
        </div>
        {isCurrent && <ApiKeyModal />}
      </Fragment>
    );
  }
}

const mapDispatchToProps = {
  getUser,
  logOut,
  setUserReportsFilters,
  queryUserReports,
};

const mapStateToProps = (state, ownProps) => ({
  userId: ownProps.match.params.id,
  isAdmin:
    getValue(state.users.currentUser, 'data.attributes.type') === 'Admin',
  isCurrent:
    getValue(state.users.currentUser, 'data.id') === ownProps.match.params.id,
  user: state.users.activeUser,
  userReports: state.users.userReports.data,
  filters: state.users.filters,
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(User);
