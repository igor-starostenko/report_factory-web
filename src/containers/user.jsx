import React, { useEffect, useState, Fragment } from 'react';
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

const ApiKeyModal = props => (
  <ConfirmModal isOpen={props.isOpen} toggle={props.toggle} title="Api Key">
    <div className={modalStyles.modalBody}>
      <h5>Your X-API-KEY:</h5>
      <h5 className={modalStyles.modalJumbo}>{props.xApiKey}</h5>
    </div>
  </ConfirmModal>
);

ApiKeyModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  xApiKey: PropTypes.string.isRequired,
};

function User(props) {
  const [isApiKeyModalOpen, setApiKeyModal] = useState(false);

  const {
    isAdmin,
    isCurrent,
    filters,
    user,
    userId,
    userReports,
    xApiKey,
  } = props;
  const isCurrentUser = user.data && getValue(user, 'data.id') === userId;

  function requestUser() {
    props.getUser(userId, xApiKey);
  }

  function fetchUserReports({ filterName, lastDays, lastMonths }) {
    props.setUserReportsFilters(userId, {
      filterName,
      lastDays,
      lastMonths,
    });
    props.queryUserReports(xApiKey, { userId, lastDays, lastMonths });
  }

  function signOut() {
    props.logOut(props.xApiKey);
    return props.history.push('/');
  }

  function toggleApiKeyModal() {
    setApiKeyModal(!isApiKeyModalOpen);
  }

  useEffect(() => {
    if (!isCurrentUser) {
      requestUser(props);
    }
    if (!getValue(userReports, userId)) {
      fetchUserReports(filters);
    }
  }, [userId]);

  if (!isCurrentUser) {
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
          <div className={styles.detailsButtons}>
            <Button
              to={`/users/${userId}/edit`}
              color="primary"
              fill="true"
              text="Edit User"
            />
            {isCurrent && (
              <Button
                onClick={toggleApiKeyModal}
                color="info"
                fill="true"
                text="View Api Key"
              />
            )}
            {isCurrent && (
              <Button
                onClick={signOut}
                color="warning"
                fill="true"
                text="Log Out"
              />
            )}
          </div>
        )}
        <div className={styles.detailsTotal}>{totalCountText}</div>
        <div className={styles.detailsContent}>
          <UserReportsLineChart
            filterAction={fetchUserReports}
            filters={filters}
            totalCount={reportsCount}
            userReports={reports}
          />
        </div>
      </div>
      {isCurrent && (
        <ApiKeyModal
          xApiKey={xApiKey}
          isOpen={isApiKeyModalOpen}
          toggle={toggleApiKeyModal}
        />
      )}
    </Fragment>
  );
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
