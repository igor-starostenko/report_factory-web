import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { editProjectSuccess, editProjectFailure,
         resetEditProject } from '../actions/projects_actions';

class EditProjectForm extends Component {
  static renderField(field) {
    const { meta: { touched, error } } = field;
    const className = `form-group ${touched && error ? 'has-danger' : ''}`;

    return (
      <div className={className}>
        <label>{field.label}</label>
        <input className="form-control" type="text" {...field.input} />
        <div className="text-help error">
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

  renderSideButton() {
    if(this.props.sideButton) {
      return this.props.sideButton();
    }
  }

  onSubmit(values, dispatch) {
    return new Promise((resolve, reject) => {
      dispatch(this.props.action(values.name))
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
    const { handleSubmit, title, backPath } = this.props;

    return (
      <div>
        <div className="formHeader">
          <h1>{title}</h1>
          {this.renderSideButton()}
        </div>
        <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          <Field
            label="Project Name"
            name="name"
            component={EditProjectForm.renderField}
          />
          <ul>{this.renderErrors()}</ul>
          <div className="formButtons">
            <Link to={backPath} className="btn btn-danger">Cancel</Link>
            <button type="submit" className="btn btn-primary">Submit</button>
          </div>
        </form>
        {this.renderSideButton()}
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
    errors.name = 'Project Name can only have letters or numbers.';
  }

  // If errors is empty, the form is fine to submit
  // If errors has *any* properties, redux form assumes form is invalid
  return errors;
};

const mapDispatchToProps = dispatch => ({
  resetMe: () => dispatch(resetEditProject()),
});

const mapStateToProps = state => ({
  editProject: state.projects.editProject,
});

export default reduxForm({
  validate,
  form: 'EditProjectForm',
})(connect(mapStateToProps, mapDispatchToProps)(EditProjectForm));
