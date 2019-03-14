import React from 'react';
import { PropTypes } from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import getValue from 'lodash/get';
import { Button, FormField, FormErrors } from '../components';
import {
  editProjectSuccess,
  editProjectFailure,
  resetEditProject,
} from '../actions/projects_actions';
import styles from './styles/Details.css';

function EditProjectForm(props) {
  function onSubmit(values, dispatch) {
    props.action(values.name).then(response => {
      if (!response.payload.data) {
        return dispatch(editProjectFailure(response.payload));
      }
      dispatch(editProjectSuccess(response.payload));
      return props.history.push('/projects');
    });
  }

  const {
    backPath,
    errors,
    handleSubmit,
    sideButton: SideButton,
    submitText,
    title,
    projectName,
  } = props;

  return (
    <div className={styles.detailsContainer}>
      <div className={styles.detailsHeader}>
        <div className={styles.detailsName}>{title}</div>
      </div>
      <SideButton />
      <form className={styles.detailsContent} onSubmit={handleSubmit(onSubmit)}>
        <Field
          label="Project Name"
          name="name"
          placeholder={projectName}
          component={FormField}
        />
        <FormErrors errors={errors} />
        <div className="formButtons">
          <Button type="submit" color="primary">
            {submitText}
          </Button>
          <Button to={backPath}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}

EditProjectForm.propTypes = {
  backPath: PropTypes.string.isRequired,
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      detail: PropTypes.string,
    }),
  ),
  handleSubmit: PropTypes.func.isRequired,
  sideButton: PropTypes.func,
  submitText: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  projectName: PropTypes.string,
  action: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

EditProjectForm.defaultProps = {
  projectName: '',
  errors: {},
  sideButton: () => <div />,
};

const validate = values => {
  const errors = {};
  const { name } = values;

  if (!name) {
    errors.name = 'Enter Project Name.';
  } else if (name.length > 15 || name.length < 3) {
    errors.name = 'Project Name has to be between 3 and 15 characters length.';
  }

  if (/[^\s\-a-zA-Z0-9]/.test(name)) {
    errors.name = 'Project Name can only have letters or numbers.';
  }

  // If errors is empty, the form is fine to submit
  // If errors has *any* properties, redux form assumes form is invalid
  return errors;
};

const mapDispatchToProps = dispatch => ({
  resetMe: () => dispatch(resetEditProject()),
});

const mapStateToProps = (state, ownProps) => ({
  projectName: ownProps.match.params.name,
  errors: getValue(state, 'projects.editProject.error', ''),
});

export default reduxForm({
  validate,
  form: 'EditProjectForm',
})(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(EditProjectForm),
);
