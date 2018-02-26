import React, { Component } from 'react';
import _ from 'lodash';
import { PaginationNumber } from '../components';
import styles from './styles/Pagination.css';

export default class Pagination extends Component {
  renderPages(lastPage) {
    const currentPage = parseInt(this.props.page, 10);
    const pageNumbers = [];
    if (lastPage > 5) {
      let startPage;
      if (currentPage > 2 && currentPage + 2 <= lastPage) {
        startPage = currentPage - 2;
      } else {
        startPage = 1;
      }
      pageNumbers.push(startPage);
      if (currentPage - 1 <= startPage) {
        pageNumbers.push(startPage + 1);
        pageNumbers.push(startPage + 2);
        pageNumbers.push(startPage + 3);
      } else if (lastPage - 2 <= currentPage) {
        pageNumbers.push(lastPage - 3);
        pageNumbers.push(lastPage - 2);
        pageNumbers.push(lastPage - 1);
      } else {
        pageNumbers.push(currentPage - 1);
        pageNumbers.push(currentPage);
        pageNumbers.push(currentPage + 1);
      }
      pageNumbers.push(lastPage);
    } else {
      for (let i = 1; i <= lastPage; i += 1) {
        pageNumbers.push(i);
      }
    }
    return _.map(pageNumbers, number => (
      <PaginationNumber
        key={number}
        value={{ page: number }}
        action={this.props.action}
        page={currentPage}
      />
    ));
  }

  render() {
    const { perPage, total } = this.props;
    const lastPage = _.ceil(parseInt(total, 10) / parseInt(perPage, 10));
    if (lastPage <= 1) {
      return (<div />);
    }

    return (
      <ul className={styles.pagination}>
        <div className={styles.pageWrapper}>
          {this.renderPages(lastPage)}
        </div>
      </ul>
    );
  }
}
