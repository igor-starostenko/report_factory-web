import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ReportsLineChart from './reports_line_chart';
import ReportsList from './reports_list';
import { getProject } from '../actions';

class Project extends Component {
  componentDidMount() {
    if (!this.props.project) {
      const { xApiKey, projectName } = this.props;
      this.props.getProject(projectName, xApiKey);
    }
  }

  formatDate(date, options) {
    const formatOptions = options || { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', formatOptions);
  }

  render() {
    const { project, projectName } = this.props;

    if (!project) {
      return (<div className="loading">Loading...</div>);
    }

    const { date } = project.data.attributes;
    const createdAt = new Date(date.created_at);

    const rspecUrl = `${this.props.match.url}/rspec`;
    const editUrl = `${this.props.match.url}/edit`;

    return (
      <div>
        <Link to="/projects">Back to projects</Link>
        <div className="project-container">
          <div className="project-header">
            <div className="project-name">{projectName}</div>
            <div className="project-since">since {this.formatDate(createdAt)}</div>
          </div>
          <div className="view-reports">
            <Link to={rspecUrl} className="btn btn-primary btn-fill">
              View Reports
            </Link>
          </div>
          <div className="edit-project">
            <Link to={editUrl} className="btn btn-warning btn-fill">
              Edit Project
            </Link>
          </div>
          <div className="chart">
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
  xApiKey: state.xApiKey,
});

export default connect(mapStateToProps, { getProject })(Project);
