import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import _ from 'lodash';
import { getReports } from '../actions/reports_actions';

class ReportsList extends Component {
  componentDidMount() {
    const { reports } = this.props;
    if (!reports || _.isEmpty(reports)) {
      const { projectName, xApiKey } = this.props;
      this.props.getReports(projectName, xApiKey);
    }
  }

  renderReports() {
    const { reports } = this.props;

    if (!reports) {
      return (<li>...</li>);
    }

    console.log(this.props.projectName);

    return _.map(reports, report => (
      <li className="list-group-item" key={report.id}>
        {report.attributes.reportable_type}
      </li>
    ));
  }

  render() {
    return (
      <div>
        <br></br>
        <ul className="list-group">
          {this.renderReports()}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  reports: state.reports[ownProps.projectName],
  xApiKey: state.xApiKey,
});

export default connect(mapStateToProps, { getReports })(ReportsList);
