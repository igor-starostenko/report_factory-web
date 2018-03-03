import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { RspecReportsBar, RspecReportsList, Pagination, FilterButton } from '../components';
import { getProjectRspecReports, getProjectRspecReportsSuccess, getProjectRspecReportsFailure,
  setProjectRspecReportsPage, resetProjectRspecReports } from '../actions/project_reports_actions';
import styles from './styles/ProjectRspecReports.css';

class ProjectRspecReports extends Component {
  constructor(props) {
    super(props);
    this.fetchProjectRspecReports = this.fetchProjectRspecReports.bind(this);
  }

  componentDidMount() {
    const { reportsList } = this.props;
    if (!reportsList || _.isEmpty(reportsList)) {
      this.fetchProjectRspecReports(this.props.perPage);
    }
  }

  componentWillUnmount() {
    this.props.resetProjectRspecReports();
  }

  fetchProjectRspecReports({ page, perPage }) {
    const { projectName, xApiKey, dispatch } = this.props;
    const options = {
      page: page || this.props.page,
      per_page: perPage || this.props.perPage,
    };
    getProjectRspecReports(projectName, xApiKey, options)
      .then((response) => {
        if (response.status !== 200) {
          return dispatch(getProjectRspecReportsFailure(response.payload));
        }
        dispatch(setProjectRspecReportsPage(response));
        return dispatch(getProjectRspecReportsSuccess(response));
      });
  }

  activeFilter(number) {
    return this.props.perPage === number;
  }

  renderFilterButtons() {
    if (!this.props.reportsList || this.props.total <= 10) {
      return (<div />);
    }
    return (
      <div className="filters">
        <ul id="chart-pills" className="nav nav-pills ct-orange">
          <FilterButton
            name="30 Per Page"
            value={{ perPage: 30 }}
            active={this.activeFilter(30)}
            action={this.fetchProjectRspecReports}
          />
          <FilterButton
            name="10 Per Page"
            value={{ perPage: 10 }}
            active={this.activeFilter(10)}
            action={this.fetchProjectRspecReports}
          />
        </ul>
      </div>
    );
  }

  render() {
    const projectUrl = `/projects/${this.props.projectName}`;

    if (!this.props.reportsList) {
      return (<div className="loading">Loading...</div>);
    }

    return (
      <div>
        <Link to={projectUrl}>Back to project</Link>
        <div className={styles.projectReportsContainer}>
          <div className={styles.projectReportsHeader}>
            <div className={styles.projectReportsName}>{this.props.projectName}</div>
          </div>
          <div className={styles.projectReportsTotal}>Total Reports: {this.props.total}</div>
          <div className={styles.projectReportsChart}>
            <RspecReportsBar
              reports={this.props.reportsList}
              displayCount={this.props.perPage}
              filterAction={this.fetchProjectRspecReports}
            />
          </div>
          <div className={styles.projectReportsList}>
            <RspecReportsList reports={this.props.reportsList} />
          </div>
          <div className={styles.projectReportsListButtons}>
            <Pagination
              className={styles.projectReportsPagination}
              page={this.props.page}
              perPage={this.props.perPage}
              total={this.props.total}
              action={this.fetchProjectRspecReports}
            />
            {this.renderFilterButtons()}
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  getProjectRspecReports: (...args) => dispatch(getProjectRspecReports(...args)),
  resetProjectRspecReports: () => dispatch(resetProjectRspecReports()),
  dispatch,
});

const mapStateToProps = ({ projectReports, users }, ownProps) => ({
  projectName: ownProps.match.params.name,
  page: projectReports.rspecReportsList.page,
  perPage: projectReports.rspecReportsList.perPage,
  total: projectReports.rspecReportsList.total,
  reportsList: projectReports.rspecReportsList.data,
  xApiKey: users.currentUser.xApiKey,
});

export default connect(mapStateToProps, mapDispatchToProps)(ProjectRspecReports);
