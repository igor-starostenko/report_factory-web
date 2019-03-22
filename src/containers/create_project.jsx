import React, { Fragment } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import EditProjectForm from './edit_project_form';
import { createProject } from '../actions/projects_actions';

function CreateProject(props) {
  function create(name) {
    return props.createProject(name, props.xApiKey);
  }

  return (
    <Fragment>
      <Link to="/projects">Back to projects</Link>
      <EditProjectForm
        title="Create a Project"
        action={create}
        backPath="/projects"
        submitText="Create"
        {...props}
      />
    </Fragment>
  );
}

CreateProject.propTypes = {
  createProject: PropTypes.func.isRequired,
  xApiKey: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(
  mapStateToProps,
  { createProject },
)(CreateProject);
