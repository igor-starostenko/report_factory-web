import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ReportsLineChart from './reports_line_chart';
import { getProject } from '../actions/projects_actions';
import styles from './styles/Details.css';

const formatDate = (date, options) => {
  const formatOptions = options || { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', formatOptions);
};

class Project extends Component {
  componentDidMount() {
    if (!this.props.project.data) {
      const { xApiKey, projectName } = this.props;
      this.props.getProject(projectName, xApiKey);
    }
  }

  render() {
    const { project, projectName } = this.props;

    if (!project.data) {
      return (<div className="loading">Loading...</div>);
    }

    const { date } = project.data.attributes;
    const createdAt = new Date(date.created_at);

    const rspecUrl = `${this.props.match.url}/rspec`;
    const editUrl = `${this.props.match.url}/edit`;

    return (
      <div>
        <Link to="/projects">Back to projects</Link>
        <div className={styles.detailsContainer}>
          <div className={styles.projectHeader}>
            <div className={styles.detailsName}>{projectName}</div>
            <div className={styles.detailsSince}>since {formatDate(createdAt)}</div>
          </div>
          <div className={`${styles.detailsButton} ${styles.viewDetails}`}>
            <Link to={rspecUrl} className="btn btn-primary btn-fill">
              View Reports
            </Link>
          </div>
          <div className={`${styles.detailsButton} ${styles.actionButton}`}>
            <Link to={editUrl} className="btn btn-warning btn-fill">
              Edit Project
            </Link>
          </div>
          <div className={styles.chart}>
            <ReportsLineChart projectName={projectName} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  projectName: ownProps.match.params.name,
  project: state.projects.activeProject,
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(mapStateToProps, { getProject })(Project);
