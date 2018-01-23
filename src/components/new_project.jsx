import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { createProject } from '../actions';

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

  onSubmit(values) {
    this.props.createProject(values.name, this.props.xApiKey)
      .then((res) => {
        this.props.history.push('/projects');
      });
  }

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

  if (!/\w{6,10}$/.test(name)) {
    errors.name = 'Project Name has to be between 3 and 11 characters length.';
  }

  if (!/^[a-zA-Z]+$/.test(name)) {
    errors.name = 'Project Name can only have letters \'a-z\' or \'A-Z\'.';
  }

  // If errors is empty, the form is fine to submit
  // If errors has *any* properties, redux form assumes form is invalid
  return errors;
};

const mapStateToProps = state => ({
  xApiKey: state.xApiKey,
  projects: state.projects,
});

export default reduxForm({
  validate,
  form: 'NewProjectForm',
})(connect(mapStateToProps, { createProject })(NewProject));
