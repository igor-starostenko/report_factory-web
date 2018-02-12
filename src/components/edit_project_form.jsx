import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import GenericForm from './generic_form';
import { editProjectSuccess, editProjectFailure,
  resetEditProject } from '../actions/projects_actions';
import styles from './styles/Details.css';

class EditProjectForm extends Component {
  onSubmit(values, dispatch) {
    this.props.action(values.name)
      .then((response) => {
        if (!response.payload.data) {
          return dispatch(editProjectFailure(response.payload));
        }
        dispatch(editProjectSuccess(response.payload));
        return this.props.history.push('/projects');
      });
  }

  renderSideButton() {
    if (this.props.sideButton) {
      return this.props.sideButton();
    }
    return (<div />);
  }

  render() {
    /* eslint-disable object-curly-newline */
    const { handleSubmit, title, backPath, editProject } = this.props;
    /* eslint-enable object-curly-newline */
    const errors = _.get(editProject, 'error');

    return (
      <div className={styles.detailsContainer}>
        <div className={styles.detailsHeader}>
          <div className={styles.detailsName}>{title}</div>
        </div>
        {this.renderSideButton()}
        <form
          className={styles.detailsContent}
          onSubmit={handleSubmit(this.onSubmit.bind(this))}
        >
          <Field
            label="Project Name"
            name="name"
            placeholder={this.props.projectName}
            component={GenericForm.renderField}
          />
          <ul>{GenericForm.renderErrors(errors)}</ul>
          <div className="formButtons">
            <button type="submit" className="btn btn-primary">Submit</button>
            <Link to={backPath} className="btn btn-danger">Cancel</Link>
          </div>
        </form>
      </div>
    );
  }
}

const validate = (values) => {
  const errors = {};
  const { name } = values;

  if (!name) {
    errors.name = 'Enter Project Name.';
  }

  if (!/\w{3,11}$/.test(name)) {
    errors.name = 'Project Name has to be between 3 and 11 characters length.';
  }

  if (/[^a-zA-Z0-9]/.test(name)) {
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
  editProject: state.projects.editProject,
});

export default reduxForm({
  validate,
  form: 'EditProjectForm',
})(connect(mapStateToProps, mapDispatchToProps)(EditProjectForm));
