import React, { Fragment, useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import getValue from 'lodash/get';
import EditProjectForm from './edit_project_form';
import { Button, ConfirmModal, Loading } from '../components';
import {
  getProject,
  updateProject,
  deleteProject,
  editProjectSuccess,
  editProjectFailure,
} from '../actions/projects_actions';
import styles from './styles/Details.css';

const hasProject = (project, projectName) => {
  const actualProjectName = getValue(project, 'data.attributes.project_name');
  return !!project.data || actualProjectName === projectName;
};

function DeleteProjectModal(props) {
  return (
    <ConfirmModal
      title={`Delete ${props.projectName}?`}
      cancel={{ children: 'Cancel' }}
      isOpen={props.isOpen}
      toggle={props.toggle}
      submit={{
        onClick: props.handleDelete,
        color: 'danger',
        children: 'Delete',
      }}
    >
      <div>
        <p>Are you sure you want to delete {props.projectName}?</p>
        <p>This action cannot be reverted!</p>
      </div>
    </ConfirmModal>
  );
}

DeleteProjectModal.propTypes = {
  projectName: PropTypes.string.isRequired,
  handleDelete: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

function DeleteProjectButton(deleteProjectButtonProps) {
  return (
    <div className={styles.detailsButtons}>
      <Button color="danger" fill="true" {...deleteProjectButtonProps}>
        Delete Project
      </Button>
    </div>
  );
}

function UpdateProject(props) {
  const [isDeleteProjectModalOpen, setDeleteProjectModel] = useState(false);
  const { dispatch, isAdmin, project, projectName, xApiKey } = props;
  const hasSameProject = hasProject(project, projectName);

  useEffect(() => {
    if (!hasSameProject) {
      props.getProject(projectName, xApiKey);
    }
  }, [projectName]);

  if (!hasSameProject) {
    return <Loading page />;
  }

  function toggleDeleteProjectModal() {
    setDeleteProjectModel(!isDeleteProjectModalOpen);
  }

  function handleDelete() {
    props.deleteProject(projectName, xApiKey).then(response => {
      if (response.payload.errors) {
        return dispatch(editProjectFailure(response.payload));
      }
      dispatch(editProjectSuccess(response.payload));
      return props.history.push('/projects');
    });
  }

  function update(newName) {
    return props.updateProject(projectName, newName, xApiKey);
  }

  function deleteProjectButton(deleteProps) {
    return (
      <DeleteProjectButton
        onClick={toggleDeleteProjectModal}
        {...deleteProps}
      />
    );
  }

  const initialValues = { name: projectName };
  const title = `Edit ${projectName} Project`;
  const backPath = `/projects/${projectName}`;

  return (
    <Fragment>
      <Link to={backPath}>Back to {projectName}</Link>
      <EditProjectForm
        title={title}
        action={update}
        sideButton={isAdmin && deleteProjectButton}
        backPath={backPath}
        submitText="Update"
        initialValues={initialValues}
        {...props}
      />
      {isAdmin && (
        <DeleteProjectModal
          isOpen={isDeleteProjectModalOpen}
          toggle={toggleDeleteProjectModal}
          handleDelete={handleDelete}
          projectName={projectName}
        />
      )}
    </Fragment>
  );
}

UpdateProject.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  project: PropTypes.shape({
    data: PropTypes.shape({
      attributes: PropTypes.object,
    }),
  }).isRequired,
  projectName: PropTypes.string.isRequired,
  xApiKey: PropTypes.string.isRequired,
  deleteProject: PropTypes.func.isRequired,
  getProject: PropTypes.func.isRequired,
  updateProject: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

const mapDispatchToProps = dispatch => ({
  getProject: (...args) => dispatch(getProject(...args)),
  updateProject: (...args) => dispatch(updateProject(...args)),
  deleteProject: (...args) => dispatch(deleteProject(...args)),
  dispatch,
});

const mapStateToProps = (state, ownProps) => ({
  projectName: ownProps.match.params.name,
  project: state.projects.activeProject,
  isAdmin:
    getValue(state.users.currentUser, 'data.attributes.type') === 'Admin',
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UpdateProject);
