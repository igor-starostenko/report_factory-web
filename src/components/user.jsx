import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import UserReportsLineChart from './user_reports_line_chart';
import { authUser, logOut } from '../actions/users_actions';

const formatDate = (date, options) => {
  const formatOptions = options || { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', formatOptions);
};

class User extends Component {
  constructor() {
    super();
    this.logOut = this.logOut.bind(this);
  }

  componentDidMount() {
    if (!this.props.user.data) {
      const { xApiKey } = this.props;
      this.props.authUser(xApiKey);
    }
  }

  logOut() {
    this.props.logOut(this.props.xApiKey);
    return this.props.history.push('/');
  }

  render() {
    if (!this.props.user.data) {
      return (<div className="loading">Loading...</div>);
    }

    const userId = this.props.user.data.id;
    const { name, date } = this.props.user.data.attributes;
    const createdAt = new Date(date.created_at);
    const userReportsUrl = `user/${userId}/reports`;

    return (
      <div>
        <div className="project-container">
          <div className="project-header">
            <div className="project-name">{name}</div>
            <div className="project-since">since {formatDate(createdAt)}</div>
          </div>
          <div className="details-button view-details">
            <Link to={userReportsUrl} className="btn btn-primary btn-fill">
              View Reports
            </Link>
          </div>
          <div className="details-button action-button">
            <button onClick={this.logOut} className="btn btn-warning btn-fill">
              Log Out
            </button>
          </div>
          <div className="chart">
            <UserReportsLineChart userId={userId} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.users.currentUser,
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(mapStateToProps, { authUser, logOut })(User);
