import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
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

    const { date } = project.attributes;
    const createdAt = date.created_at;
    const updatedAt = date.updated_at;

    return (
      <div>
        <h1>{project.attributes.project_name}</h1>
        <h6>Created: {createdAt}</h6>
        <h6>Updated: {updatedAt}</h6>
        <Link to="/projects">Back</Link>
        <button className="btn btn-danger pull-xs-right">
          Edit project
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  project: state.projects[ownProps.match.params.name],
  xApiKey: state.xApiKey,
});

export default connect(mapStateToProps, { getProject })(Project);
