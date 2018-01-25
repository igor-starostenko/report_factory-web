import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import RspecReportsBar from './rspec_reports_bar';
import ReportsList from './reports_list';

class RspecReports extends Component {
  render() {
    const projectName = this.props.match.params.name;
    const projectUrl = `/projects/${projectName}`;

    return (
      <div>
        <Link to={projectUrl}>Back to project</Link>
        <div className="project-container">
          <div className="project-header">
            <div className="project-name">{projectName}</div>
          </div>
          <div className="chart">
            <RspecReportsBar projectName={projectName} />
          </div>
        </div>
      </div>
    );
  }
}

export default RspecReports;
