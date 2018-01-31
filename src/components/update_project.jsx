import React, { Component } from 'react';
import { connect } from 'react-redux';
import EditProjectForm from './edit_project_form';
import { updateProject, deleteProject, editProjectSuccess,
         editProjectFailure } from '../actions/projects_actions';

class UpdateProject extends Component {
  handeDelete() {
    const { dispatch, projectName, xApiKey } = this.props;
    if (confirm(`Are you sure you want to delete "${projectName}" project?`)) {
      return new Promise((resolve, reject) => {
        dispatch(this.props.deleteProject(projectName, xApiKey))
          .then(response => {
            if(response.payload.errors) {
              dispatch(editProjectFailure(response.payload));
            } else {
              dispatch(editProjectSuccess(response.payload));
              resolve();//this is for redux-form itself
              return this.props.history.push('/projects');
            }
        });
     });
    }
  }

  deleteButton() {
    return (
      <div>
        <button onClick={this.handeDelete.bind(this)} id="delete"
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

const mapDispatchToProps = dispatch => ({
  updateProject: updateProject,
  deleteProject: deleteProject,
  dispatch: dispatch,
  resetMe: () => dispatch(resetEditProject()),
});

const mapStateToProps = (state, ownProps) => ({
  projectName: ownProps.match.params.name,
  xApiKey: state.xApiKey,
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProject);
