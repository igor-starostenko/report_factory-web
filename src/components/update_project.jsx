import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import EditProjectForm from './edit_project_form';
import { getProject, updateProject, deleteProject, editProjectSuccess,
  editProjectFailure } from '../actions/projects_actions';

const hasProject = (project, projectName) => {
  const actualProjectName = _.get(project, 'data.attributes.project_name');
  return !!project.data || actualProjectName === projectName;
};
class UpdateProject extends Component {
  constructor(state) {
    super(state);
    this.update = this.update.bind(this);
    this.deleteButton = this.deleteButton.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    const { project, projectName, xApiKey } = this.props;
    if (!hasProject(project, projectName)) {
      this.props.getProject(projectName, xApiKey);
    }
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
      this.props.deleteProject(projectName, xApiKey)
        .then((response) => {
          if (response.payload.errors) {
            return dispatch(editProjectFailure(response.payload));
          }
          dispatch(editProjectSuccess(response.payload));
          return this.props.history.push('/projects');
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
    const { project, projectName } = this.props;
    if (!hasProject(project, projectName)) {
      return (<div className="loading">Loading...</div>);
    }

    const initialValues = { name: projectName };
    const title = `Edit ${projectName} Project`;
    const backPath = `/projects/${projectName}`;

    return (
      <div>
        <EditProjectForm
          title={title}
          action={this.update}
          sideButton={this.deleteButton}
          backPath={backPath}
          initialValues={initialValues}
          {...this.props}
        />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  getProject: (...args) => dispatch(getProject(...args)),
  updateProject: (...args) => dispatch(updateProject(...args)),
  deleteProject: (...args) => dispatch(deleteProject(...args)),
  dispatch,
});

const mapStateToProps = (state, ownProps) => ({
  projectName: ownProps.match.params.name,
  project: state.projects.activeProject,
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProject);
