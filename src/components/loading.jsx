import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Spinner } from 'reactstrap';
import styles from './styles/Loading.css';

export default class Loading extends Component {
  render() {
    return (
      <div className={styles.loading}>
        <span>Loading</span>
        <Spinner {...this.props} />
        <Spinner {...this.props} />
        <Spinner {...this.props} />
      </div>
    );
  }
}

Loading.propTypes = {
  type: PropTypes.string,
  color: PropTypes.string,
};

Loading.defaultProps = {
  type: 'grow',
  color: 'info',
};