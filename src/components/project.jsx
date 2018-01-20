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

  render() {
    const { project } = this.props;

    if (!project) {
      return <div>Loading...</div>;
    }

    const projectName = project.attributes.project_name;
    const { date } = project.attributes;
    const createdAt = date.created_at;
    const updatedAt = date.updated_at;

    return (
      <div>
        <div>
          <h1>{projectName}</h1>
          <h6>Created: {createdAt}</h6>
          <h6>Updated: {updatedAt}</h6>
          <Link to="/projects">Back</Link>
          <button className="btn btn-danger pull-xs-right">
            Edit project
          </button>
        </div>
        <div>
          <ReportsLineChart projectName={projectName} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  project: state.projects[ownProps.match.params.name],
  xApiKey: state.xApiKey,
});

export default connect(mapStateToProps, { getProject })(Project);
