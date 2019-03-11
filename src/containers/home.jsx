import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import { Jumbotron } from 'reactstrap';
import { Button } from '../components';
import styles from './styles/Home.css';

class Home extends Component {
  isLoggedIn() {
    return !!(this.props.xApiKey || Cookies.get('X-API-KEY'));
  }

  render() {
    const imageSrc = '/style/assets/img/rf-apple-icon.png';
    return (
      <div className={styles.homeContainer}>
        <Jumbotron className="fadeIn text-center">
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
          {!this.isLoggedIn() && (
            <Button
              className={styles.homeLogin}
              to="/login"
              color="info"
              size="lg"
            >
              Login
            </Button>
          )}
        </Jumbotron>
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
