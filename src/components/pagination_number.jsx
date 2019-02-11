import React, { Component } from 'react';
import styles from './styles/Pagination.css';

export default class PaginationNumber extends Component {
  constructor(props) {
    super(props);
    this.handlePageClick = this.handlePageClick.bind(this);
  }

  handlePageClick() {
    this.props.action(this.props.value);
  }

  render() {
    const isActive = this.props.page === this.props.value.page;
    const pageStyle = isActive ? 'pageActive' : '';
    return (
      /* eslint-disable jsx-a11y/click-events-have-key-events */
      /* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
      <li
        onClick={this.handlePageClick}
        className={`${styles.pageNumber} ${pageStyle}`}
      >
        {this.props.value.page}
      </li>
      /* eslint-enable jsx-a11y/click-events-have-key-events */
      /* eslint-enable jsx-a11y/no-noninteractive-element-interactions */
    );
  }
}
