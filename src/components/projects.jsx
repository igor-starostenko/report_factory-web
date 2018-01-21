import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { getProjects } from '../actions';

class Projects extends Component {
  componentDidMount() {
    const { xApiKey } = this.props;
    if (xApiKey) {
      this.props.getProjects(xApiKey);
    }
  }

  renderProjects() {
    return _.map(this.props.projects, (project) => {
      const projectName = project.attributes.project_name;
      const projectPath = `/projects/${projectName}`;
      return (
        <div className="row" key={project.id}>
          <div className="well">
            <Link to={projectPath}>{projectName}</Link>
          </div>
        </div>
      );
    });
  }

  render() {
    return (
      <div>
        <h1>Projects</h1>
        <div>
          {this.renderProjects()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  projects: state.projects,
  xApiKey: state.xApiKey,
});

export default connect(mapStateToProps, { getProjects })(Projects);
