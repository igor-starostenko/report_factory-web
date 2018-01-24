import React, { Component } from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { createProject, createProjectSuccess, createProjectFailure,
         resetNewProject } from '../actions';

class NewProject extends Component {
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
    if (this.props.newProject) {
      let i = 0;
      return _.map(this.props.newProject.error, error => {
        return (<li key={i++} className="error">{error.detail}</li>);
      });
    }
  }

  onSubmit(values, dispatch) {
    return new Promise((resolve, reject) => {
      dispatch(this.props.createProject(values.name, this.props.xApiKey))
        .then(response => {
          if(!response.payload.data) {
            dispatch(createProjectFailure(response.payload));
            reject(response.data); //this is for redux-form itself
          } else {
            dispatch(createProjectSuccess(response.payload));
            resolve();//this is for redux-form itself
            return this.props.history.push('/projects');
          }
      });
     });
    };

  render() {
    const { handleSubmit } = this.props;

    return (
      <div>
        <h1>Create Project</h1>
        <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          <Field
            label="Project Name"
            name="name"
            component={NewProject.renderField}
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

  if (!/^[a-zA-Z]+$/.test(name)) {
    errors.name = 'Project Name can only have letters \'a-z\' or \'A-Z\'.';
  }

  // If errors is empty, the form is fine to submit
  // If errors has *any* properties, redux form assumes form is invalid
  return errors;
};

const mapDispatchToProps = dispatch => ({
  createProject: createProject,
  resetMe: () => dispatch(resetNewProject()),
});

const mapStateToProps = state => ({
  xApiKey: state.xApiKey,
  newProject: state.projects.newProject,
});

export default reduxForm({
  validate,
  form: 'NewProjectForm',
})(connect(mapStateToProps, mapDispatchToProps)(NewProject));
