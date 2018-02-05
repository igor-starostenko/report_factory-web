import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { getApiKey } from '../actions/users_actions';

class Home extends Component {
  constructor(state) {
    super(state);
    this.state = { loggedIn: false };
  }

  componentDidMount() {
    const { currentUser, xApiKey } = this.props;
    if (_.isEmpty(xApiKey)) {
      if (!getApiKey(currentUser).payload) {
        /* eslint-disable react/no-did-mount-set-state */
        this.setState({ loggedIn: true });
        /* eslint-enable react/no-did-mount-set-state */
      }
    }
  }

  renderLogin() {
    if (this.state.loggedIn) {
      return (
        <div>
          <Link to="/login" className="btn btn-lg btn-info btn-fill">Login</Link>
        </div>
      );
    }
    return (<div />);
  }

  render() {
    const imageSrc = '/style/assets/img/rf-apple-icon.png';
    return (
      <div className="text-center">
        <h1>Welcome to ReportFactory</h1>
        <img src={imageSrc} alt="Report Factory Gears" title="Report Factory Gears" />
        <p>
          See <a href="https://github.com/igor-starostenko/report_factory-web">github</a> for more info.
        </p>
        {this.renderLogin()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.currentUser,
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(mapStateToProps, { getApiKey })(Home);
