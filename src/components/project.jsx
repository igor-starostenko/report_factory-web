import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ReportsLineChart from './reports_line_chart';
import ReportsList from './reports_list';
import { getProject } from '../actions';

class Project extends Component {
  componentDidMount() {
    if (!this.props.project) {
      const { xApiKey } = this.props;
      const { name } = this.props.match.params;
      this.props.getProject(name, xApiKey);
    }
  }

  formatDate(date, options) {
    const formatOptions = options || { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', formatOptions);
  }

  render() {
    const { project, projectName } = this.props;

    console.log(project);

    if (!project) {
      return (<div>Loading...</div>);
    }

    const { date } = project.data.attributes;
    const createdAt = new Date(date.created_at);

    const rspecUrl = `${this.props.match.url}/rspec`;

    return (
      <div>
        <Link to="/projects">Back to projects</Link>
        <div className="project-container">
          <div className="project-header">{projectName}</div>
          <div className="project-since">since {this.formatDate(createdAt)}</div>
          <div className="view-reports">
            <Link to={rspecUrl} className="btn btn-primary">
              View Reports
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
