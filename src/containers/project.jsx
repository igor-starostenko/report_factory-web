import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from '../components';
import ReportsLineChart from './reports_line_chart';
import { getProject, resetProject } from '../actions/projects_actions';
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
          <div className={styles.detailsHeader}>
            <div className={styles.detailsName}>{projectName}</div>
          </div>
          <div className={styles.detailsButtons}>
            <Button to={rspecUrl} color="primary" fill="true" text="View Reports" />
            <Button to={editUrl} color="warning" fill="true" text="Edit Project" />
          </div>
          <div className={styles.detailsSince}>since {formatDate(createdAt)}</div>
          <div className={styles.detailsContent}>
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

export default connect(mapStateToProps, { getProject, resetProject })(Project);
