import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
// import { getProject, getReports } from '../actions';

class Project extends Component {
  componentDidMount() {
    const { name } = this.props.match.params;
    // this.props.fetchproject(id);
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
        <Link to="/projects">Back To Projects</Link>
        <button className="btn btn-danger pull-xs-right">
          Update project
        </button>
      </div>
    );
  }
}

const mapStateToProps = ({ projects }, ownProps) => ({
  project: projects[ownProps.match.params.name],
});

export default connect(mapStateToProps, { })(Project);
