import React, { Component } from 'react';
import _ from 'lodash';
import { PaginationNumber } from '../components';
import styles from './styles/Pagination.css';

export default class PaginationConnection extends Component {
  renderPages(lastPage) {
    const currentPage = parseInt(this.props.page, 10);
    const pages = [];
    const startPage = 1;
    pages.push({ page: startPage, start: true });
    if (lastPage > 3) {
      if (currentPage === startPage) {
        // 1, 2, '...', 148
        pages.push({ page: currentPage + 1, next: true });
        pages.push({ page: currentPage + 2, ellipsis: true });
      } else if (currentPage - 1 === startPage) {
        // 1, 2, 3, '...', 148
        pages.push({ page: currentPage });
        pages.push({ page: currentPage + 1, next: true });
        pages.push({ page: currentPage + 2, ellipsis: true });
      } else if (lastPage - 2 >= currentPage) {
        // 1, 3, 4, 5, 148
        pages.push({ page: currentPage - 1, previous: true });
        pages.push({ page: currentPage });
        pages.push({ page: currentPage + 1, next: true });
      } else if (lastPage - 1 === currentPage) {
        // 1, '...', 146, 147, 148
        pages.push({ page: currentPage - 2, ellipsis: true });
        pages.push({ page: currentPage - 1, previous: true });
        pages.push({ page: currentPage });
      } else {
        // 1, '...', 147, 148
        pages.push({ page: currentPage - 2, ellipsis: true });
        pages.push({ page: currentPage - 1, previous: true });
      }
    } else if (lastPage === 3){
      // 1, 2, 3
      pages.push({ page: 2, next: (currentPage === 1) });
    }
    pages.push({ page: lastPage, end: true });
    return _.map(pages, (obj) => {
      if (obj.ellipsis) {
        return (<div key={obj.page} className={styles.ellipsis}>...</div>);
      }
      return (
        <PaginationNumber
          key={obj.page}
          value={obj}
          action={this.props.action}
          page={currentPage}
        />
      );
    });
  }

  render() {
    const { perPage, totalCount } = this.props;
    const lastPage = _.ceil(parseInt(totalCount, 10) / parseInt(perPage, 10));
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
