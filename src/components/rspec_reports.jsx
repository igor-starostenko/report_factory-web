import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import RspecReportsBar from './rspec_reports_bar';
import ReportsList from './reports_list';
import { getRspecReports } from '../actions';

class RspecReports extends Component {
  render() {
    const projectName = this.props.match.params.name;
    const projectUrl = `/projects/${projectName}`;

    return (
      <div>
        <div>
          <h1>{projectName}</h1>
          <Link to={projectUrl}>Back</Link>
        </div>
        <div>
          <RspecReportsBar projectName={projectName} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  rspecReports: state.rspecReports,
  xApiKey: state.xApiKey,
});

export default connect(mapStateToProps, { getRspecReports })(RspecReports);
