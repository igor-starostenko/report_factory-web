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
        <button className="list-group-item" key={project.id}>
          <Link to={projectPath}>{projectName}</Link>
        </button>
      );
    });
  }

  render() {
    return (
      <div>
        <h1>Projects</h1>
        <div>
          <ul className="list-group">
            {this.renderProjects()}
          </ul>
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
