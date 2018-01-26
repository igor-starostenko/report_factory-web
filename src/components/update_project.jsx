import React, { Component } from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { updateProject, editProjectSuccess, editProjectFailure,
         resetEditProject } from '../actions';

class UpdateProject extends Component {
  static renderField(field) {
    const { meta: { touched, error } } = field;
    const className = `form-group ${touched && error ? 'has-danger' : ''}`;

    return (
      <div className={className}>
        <label>{field.label}</label>
        <input className="form-control" type="text" {...field.input} />
        <div className="text-help">
          {touched ? error : ''}
        </div>
      </div>
    );
  }

  renderErrors() {
    if (this.props.editProject) {
      let i = 0;
      return _.map(this.props.editProject.error, error => {
        return (<li key={i++} className="error">{error.detail}</li>);
      });
    }
  }

  onSubmit(values, dispatch) {
    return new Promise((resolve, reject) => {
      const { projectName, xApiKey } = this.props;
      dispatch(this.props.updateProject(projectName, values.name, xApiKey))
        .then(response => {
          if(!response.payload.data) {
            dispatch(editProjectFailure(response.payload));
            reject(response.data); //this is for redux-form itself
          } else {
            dispatch(editProjectSuccess(response.payload));
            resolve();//this is for redux-form itself
            return this.props.history.push('/projects');
          }
      });
     });
    };

  render() {
    const { handleSubmit, projectName } = this.props;

    return (
      <div>
        <h1>Edit {projectName} project</h1>
        <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          <Field
            label="Project Name"
            name="name"
            component={UpdateProject.renderField}
          />
          <ul>{this.renderErrors()}</ul>
          <button type="submit" className="btn btn-primary">Submit</button>
          <Link to="/projects" className="btn btn-danger">Cancel</Link>
        </form>
      </div>
    );
  }
}

const validate = (values) => {
  const errors = {};
  const name = values.name;

  if (!name) {
    errors.name = 'Enter Project Name.';
  }

  if (!/\w{3,11}$/.test(name)) {
    errors.name = 'Project Name has to be between 3 and 11 characters length.';
  }

  if (/[^a-zA-Z0-9]/.test(name)) {
    errors.name = 'Project Name can only have letters \'a-z\' or \'A-Z\'.';
  }

  // If errors is empty, the form is fine to submit
  // If errors has *any* properties, redux form assumes form is invalid
  return errors;
};

const mapDispatchToProps = dispatch => ({
  updateProject: updateProject,
  resetMe: () => dispatch(resetNewProject()),
});

const mapStateToProps = (state, ownProps) => ({
  projectName: ownProps.match.params.name,
  xApiKey: state.xApiKey,
  editProject: state.projects.editProject,
});

export default reduxForm({
  validate,
  form: 'UpdateProjectForm',
})(connect(mapStateToProps, mapDispatchToProps)(UpdateProject));
