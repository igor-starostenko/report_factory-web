import React, { Component } from 'react';
import { connect } from 'react-redux';
import EditProjectForm from './edit_project_form';
import { createProject } from '../actions';

class CreateProject extends Component {
  create(name) {
     return this.props.createProject(name, this.props.xApiKey);
  }

  render() {
    const title = "Create Project";

    return (
      <div>
        <EditProjectForm title={title} action={this.create.bind(this)}
          backPath="/projects" {...this.props} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  xApiKey: state.xApiKey,
});

export default connect(mapStateToProps, { createProject })(CreateProject);
