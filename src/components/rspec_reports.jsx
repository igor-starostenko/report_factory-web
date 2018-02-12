import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import RspecReportsBar from './rspec_reports_bar';
// import ReportsList from './reports_list';
import styles from './styles/Details.css';

class RspecReports extends Component {
  render() {
    const projectName = this.props.match.params.name;
    const projectUrl = `/projects/${projectName}`;

    return (
      <div>
        <Link to={projectUrl}>Back to project</Link>
        <div className={styles.detailsContainer}>
          <div className={styles.detailsHeader}>
            <div className={styles.detailsName}>{projectName}</div>
          </div>
          <div className={styles.detailsContent}>
            <RspecReportsBar projectName={projectName} />
          </div>
        </div>
      </div>
    );
  }
}

export default RspecReports;
