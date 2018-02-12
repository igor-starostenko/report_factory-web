import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import EditProjectForm from './edit_project_form';
import { createProject } from '../actions/projects_actions';

class CreateProject extends Component {
  constructor(state) {
    super(state);
    this.create = this.create.bind(this);
  }

  create(name) {
    return this.props.createProject(name, this.props.xApiKey);
  }

  render() {
    const title = 'Create a Project';

    return (
      <div>
        <Link to="/projects">Back to projects</Link>
        <EditProjectForm
          title={title}
          action={this.create}
          backPath="/projects"
          {...this.props}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(mapStateToProps, { createProject })(CreateProject);
