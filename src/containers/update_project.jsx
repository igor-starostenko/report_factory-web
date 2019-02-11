import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import EditProjectForm from './edit_project_form';
import { Button, ConfirmModal } from '../components';
import {
  getProject,
  updateProject,
  deleteProject,
  editProjectSuccess,
  editProjectFailure,
} from '../actions/projects_actions';
import styles from './styles/Details.css';

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

  handleDelete() {
    const { dispatch, projectName, xApiKey } = this.props;
    this.props.deleteProject(projectName, xApiKey).then(response => {
      if (response.payload.errors) {
        return dispatch(editProjectFailure(response.payload));
      }
      dispatch(editProjectSuccess(response.payload));
      return this.props.history.push('/projects');
    });
  }

  deleteButton() {
    if (this.props.isAdmin) {
      const title = `Delete ${this.props.projectName}?`;
      const content = (
        <div>
          <p>Are you sure you want to delete {this.props.projectName}?</p>
          <p>This action cannot be reverted!</p>
        </div>
      );
      return (
        <div className={styles.detailsButtons}>
          <Button
            data-toggle="modal"
            data-target="#deleteModal"
            id="delete"
            color="danger"
            fill="true"
            text="Delete Project"
          />
          <ConfirmModal
            id="deleteModal"
            title={title}
            content={content}
            cancelText="Cancel"
            submitText="Delete"
            submit={{ onClick: this.handleDelete }}
          />
        </div>
      );
    }
    return <div />;
  }

  update(newName) {
    const { projectName, xApiKey } = this.props;
    return this.props.updateProject(projectName, newName, xApiKey);
  }

  render() {
    const { project, projectName } = this.props;
    if (!hasProject(project, projectName)) {
      return <div className="loading">Loading...</div>;
    }

    const initialValues = { name: projectName };
    const title = `Edit ${projectName} Project`;
    const backPath = `/projects/${projectName}`;

    return (
      <div>
        <Link to={backPath}>Back to {projectName}</Link>
        <EditProjectForm
          title={title}
          action={this.update}
          sideButton={this.deleteButton}
          backPath={backPath}
          submitText="Update"
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
  isAdmin: _.get(state.users.currentUser, 'data.attributes.type') === 'Admin',
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UpdateProject);
