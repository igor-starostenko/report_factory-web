import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ReportsLineChart from './reports_line_chart';
import ReportsList from './reports_list';
import { getProject } from '../actions';

class ProjectDetails extends Component {
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
    const { project } = this.props;

    if (!project) {
      return (<div>Loading...</div>);
    }

    const { date } = project.data.attributes;
    const createdAt = new Date(date.created_at);

    const rspecUrl = `${this.props.match.url}/rspec`;

    return (
      <div className="project-container">
        <div className="project-header">
          <div className="project-name">{this.props.match.params.name}</div>
          <div className="project-since">since {this.formatDate(createdAt)}</div>
        </div>
        {this.props.content}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  project: state.projects.activeProject,
  xApiKey: state.xApiKey,
});

export default connect(mapStateToProps, { getProject })(ProjectDetails);
