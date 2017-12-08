import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getProjects } from '../actions';

class Projects extends Component {
  componentDidMount() {
    const xApiKey = '9e04136f-c71d-4d16-924a-216e9af08903';
    this.props.getProjects(xApiKey);
  }

  render() {
    if (!this.props.projects) {
      return
    }

    console.log(this.props.projects);

    return (
      <div>
        <h1>Projects</h1>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { projects: state.projects };
}

export default connect(mapStateToProps, { getProjects })(Projects);
