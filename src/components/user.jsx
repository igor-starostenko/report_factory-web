import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { authUser } from '../actions';

class User extends Component {
  componentDidMount() {
    if (!this.props.user) {
      const { xApiKey } = this.props;
      this.props.authUser(xApiKey);
    }
  }

  formatDate(date, options) {
    const formatOptions = options || { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', formatOptions);
  }

  render() {
    if (!this.props.user) {
      return (<div className="loading">Loading...</div>);
    }

    const { userId } = this.props.user.data.id;
    const { name, email, type, date } = this.props.user.data.attributes;
    const createdAt = new Date(date.created_at);

    const userReportsUrl = `user/${userId}/reports`;

    return (
      <div>
        <div className="project-container">
          <div className="project-header">
            <div className="project-name">{name}</div>
            <div className="project-since">since {this.formatDate(createdAt)}</div>
          </div>
          <div className="view-reports">
            <Link to={userReportsUrl} className="btn btn-primary btn-fill">
              View Reports
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.users.currentUser,
  xApiKey: state.xApiKey,
});

export default connect(mapStateToProps, { authUser })(User);
