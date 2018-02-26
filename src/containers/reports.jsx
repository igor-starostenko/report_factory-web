import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { getRspecReports, setRspecReportsPage, getRspecReportsSuccess,
  getRspecReportsFailure, resetRspecReports } from '../actions/reports_actions';
import styles from './styles/Reports.css';

class Reports extends Component {
  componentDidMount() {
    const { reportsList } = this.props;
    if (!reportsList || _.isEmpty(reportsList)) {
      this.fetchRspecReports(this.props.perPage);
    }
  }

  fetchRspecReports(perPage) {
    const { xApiKey, dispatch } = this.props;
    const options = { page: this.props.page, per_page: perPage };
    getRspecReports(xApiKey, options)
      .then((response) => {
        if (response.status !== 200) {
          return dispatch(getRspecReportsFailure(response.payload));
        }
        dispatch(setRspecReportsPage(response));
        return dispatch(getRspecReportsSuccess(response));
      });
  }

  renderReports() {
    console.log(this.props.reports);
    // return _.map(this.props.reports, (report) => {
    //   const projectName = project.attributes.project_name;
    //   const projectDescription = project.attributes.project_description;
    //   const projectPath = `/projects/${projectName}`;
    //   return (
    //     <Link to={projectPath} className={styles.project} key={project.id}>
    //       <div className={styles.projectBody}>
    //         <div className={styles.projectTitle}>{projectName}</div>
    //         <p className={styles.projectText}>{projectDescription}</p>
    //       </div>
    //     </Link>
    //   );
    // });
  }

  render() {
    return (
      <div>
        <br />
        <h1>Reports</h1>
        <div className={styles.reportsContainer}>
          {this.renderReports()}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  getRspecReports: (...args) => dispatch(getRspecReports(...args)),
  resetRspecReports: () => dispatch(resetRspecReports()),
  dispatch,
});

const mapStateToProps = state => ({
  page: state.reports.rspecReportsList.page,
  perPage: state.reports.rspecReportsList.perPage,
  total: state.reports.rspecReportsList.total,
  reports: state.reports.rspecReportsList.data,
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(mapStateToProps, mapDispatchToProps)(Reports);
