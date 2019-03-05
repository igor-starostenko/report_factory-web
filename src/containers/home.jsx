import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import { LinkButton } from '../components';
import styles from './styles/Home.css';

class Home extends Component {
  constructor(state) {
    super(state);
    this.state = { loggedIn: false };
  }

  componentDidMount() {
    const xApiKey = this.props.xApiKey || Cookies.get('X-API-KEY');
    if (xApiKey) {
      /* eslint-disable react/no-did-mount-set-state */
      this.setState({ loggedIn: true });
      /* eslint-enable react/no-did-mount-set-state */
    }
  }

  render() {
    const imageSrc = '/style/assets/img/rf-apple-icon.png';
    return (
      <div className={styles.homeContainer}>
        <div className="jumbotron fadeIn text-center">
          <h1>Welcome to Report Factory</h1>
          <img
            className={styles.homeLogo}
            src={imageSrc}
            alt="Report Factory Gears"
            title="Report Factory Gears"
          />
          <p>
            See{' '}
            <a href="https://github.com/igor-starostenko/report_factory-web">
              github
            </a>{' '}
            for more info.
          </p>
          {!this.state.loggedIn && (
            <LinkButton
              className={styles.homeLogin}
              to="/login"
              color="info"
              size="lg"
            >
              Login
            </LinkButton>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  xApiKey: state.users.currentUser.xApiKey,
});

export default connect(
  mapStateToProps,
  {},
)(Home);
