import React, { Component } from 'react';
import { connect } from 'react-redux';
import EditProjectForm from './edit_project_form';
import { updateProject, deleteProject, editProjectSuccess,
  editProjectFailure } from '../actions/projects_actions';

class UpdateProject extends Component {
  constructor(state) {
    super(state);
    this.update = this.update.bind(this);
    this.deleteButton = this.deleteButton.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  /* eslint-disable consistent-return */
  handleDelete() {
    const { dispatch, projectName, xApiKey } = this.props;
    /* eslint-disable no-restricted-globals */
    /* eslint-disable no-alert */
    /* eslint-disable no-undef */
    if (confirm(`Are you sure you want to delete "${projectName}" project?`)) {
    /* eslint-enable no-restricted-globals */
    /* eslint-enable no-alert */
    /* eslint-enable no-undef */
      return new Promise((resolve, reject) => {
        dispatch(this.props.deleteProject(projectName, xApiKey))
          .then((response) => {
            if (response.payload.errors) {
              dispatch(editProjectFailure(response.payload));
              return reject(); // this is for redux-form itself
            }
            dispatch(editProjectSuccess(response.payload));
            resolve(); // this is for redux-form itself
            return this.props.history.push('/projects');
          });
      });
    }
  }
  /* eslint-enable consistent-return */

  deleteButton() {
    return (
      <div>
        <button
          onClick={this.handleDelete}
          id="delete"
          className="btn btn-danger btn-fill"
        >Delete Project
        </button>
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
        <EditProjectForm
          title={title}
          action={this.update}
          sideButton={this.deleteButton}
          backPath={backPath}
          {...this.props}
        />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  updateProject, deleteProject, dispatch,
});

const mapStateToProps = (state, ownProps) => ({
  projectName: ownProps.match.params.name,
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProject);
