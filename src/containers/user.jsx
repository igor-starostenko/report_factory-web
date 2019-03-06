import React, { Component, Fragment } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import getValue from 'lodash/get';
import {
  Button,
  ConfirmModal,
  Loading,
  UserReportsLineChart,
} from '../components';
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

LogOutButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

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

DetailsButtons.propTypes = {
  userId: PropTypes.string.isRequired,
  isCurrent: PropTypes.bool.isRequired,
  onLogOut: PropTypes.func.isRequired,
};

const ModalContent = props => (
  <div className={modalStyles.modalBody}>
    <h5>Your X-API-KEY:</h5>
    <h5 className={modalStyles.modalJumbo}>{props.xApiKey}</h5>
  </div>
);

ModalContent.propTypes = {
  xApiKey: PropTypes.string.isRequired,
};

const ApiKeyModal = props => (
  <ConfirmModal id="viewApiKey" title="Api Key" cancelText="Ok">
    <ModalContent xApiKey={props.xApiKey} />
  </ConfirmModal>
);

ApiKeyModal.propTypes = {
  xApiKey: PropTypes.string.isRequired,
};

class User extends Component {
  constructor() {
    super();
    this.logOut = this.logOut.bind(this);
    this.queryUserReports = this.queryUserReports.bind(this);
  }

  componentDidMount() {
    this.requestUser();
    const { filters, userReports, userId } = this.props;
    if (!getValue(userReports, userId)) {
      this.queryUserReports(filters);
    }
  }

  componentDidUpdate() {
    this.requestUser();
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
    const {
      user,
      userId,
      userReports,
      filters,
      isAdmin,
      isCurrent,
      xApiKey,
    } = this.props;
    if (!user.data || getValue(user, 'data.id') !== userId) {
      return <Loading />;
    }

    const { name } = user.data.attributes;
    const { reports, reportsCount } = userReports;
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
              filters={filters}
              totalCount={reportsCount}
              userReports={reports}
            />
          </div>
        </div>
        {isCurrent && <ApiKeyModal xApiKey={xApiKey} />}
      </Fragment>
    );
  }
}

User.propTypes = {
  user: PropTypes.shape({
    data: PropTypes.shape({
      attributes: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
    }),
  }).isRequired,
  userId: PropTypes.string.isRequired,
  userReports: PropTypes.shape({
    reports: PropTypes.arrayOf(PropTypes.object),
    reportsCount: PropTypes.number,
  }).isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isCurrent: PropTypes.bool.isRequired,
  xApiKey: PropTypes.string.isRequired,
  logOut: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  getUser: PropTypes.func.isRequired,
  setUserReportsFilters: PropTypes.func.isRequired,
  queryUserReports: PropTypes.func.isRequired,
  filters: PropTypes.shape({
    filterName: PropTypes.string.isRequired,
    lastDays: PropTypes.number,
    lastMonths: PropTypes.number,
  }),
};

User.defaultProps = {
  filters: { filterName: 'Week', lastDays: 8 },
};

const mapDispatchToProps = {
  getUser,
  logOut,
  setUserReportsFilters,
  queryUserReports,
};

const mapStateToProps = (state, { match: { params } }) => ({
  userId: params.id,
  isAdmin:
    getValue(state.users.currentUser, 'data.attributes.type') === 'Admin',
  isCurrent: getValue(state.users.currentUser, 'data.id') === params.id,
  user: state.users.activeUser,
  userReports: getValue(state.users.userReports.data, params.id, {}),
  filters: getValue(state.users.filters, params.id),
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(User);
