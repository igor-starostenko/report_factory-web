import React, { Component } from 'react';
import { connect } from 'react-redux';
import EditProjectForm from './edit_project_form';
import { updateProject } from '../actions';

class UpdateProject extends Component {
  deleteProject() {
    alert(`Are you sure you want to delete ${this.props.projectName} project?`);
  }

  deleteButton() {
    return (
      <div>
        <button onClick={this.deleteProject.bind(this)} id="delete"
           className="btn btn-danger btn-fill">Delete Project</button>
      </div>
    );
  }

  update(newName) {
    const { projectName, xApiKey } = this.props;
    return this.props.updateProject(projectName, newName, xApiKey);
  }

  render() {
    const title = `Edit ${this.props.projectName} Project`;
    const backPath = `/projects/${this.props.projectName}`;

    return (
      <div>
        <EditProjectForm title={title} action={this.update.bind(this)}
          sideButton={this.deleteButton.bind(this)} backPath={backPath} {...this.props} />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  projectName: ownProps.match.params.name,
  xApiKey: state.xApiKey,
});

export default connect(mapStateToProps, { updateProject })(UpdateProject);
