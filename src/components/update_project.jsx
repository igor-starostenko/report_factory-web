import React, { Component } from 'react';
import { connect } from 'react-redux';
import EditProjectForm from './edit_project_form';
import { updateProject } from '../actions';

class UpdateProject extends Component {
  update(newName) {
    const { projectName, xApiKey } = this.props;
    return this.props.updateProject(projectName, newName, xApiKey);
  }

  render() {
    const title = `Edit ${this.props.projectName} Project`;

    return (
      <div>
        <EditProjectForm title={title} action={this.update.bind(this)} {...this.props} />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  projectName: ownProps.match.params.name,
  xApiKey: state.xApiKey,
});

export default connect(mapStateToProps, { updateProject })(UpdateProject);
