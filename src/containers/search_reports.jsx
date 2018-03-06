import React, { Component } from 'react';
import { Field, reduxForm, reset } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Button } from '../components';
import styles from './styles/SearchReports.css';

const formatTags = (tags) => {
  if (_.isEmpty(tags)) {
    return { tags: [] };
  }
  const noSpecialCharsString = tags.replace(/[^\w\s]/gi, '');
  return { tags: _.split(noSpecialCharsString, ' ') };
};

class SearchReports extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillUnmount() {
    this.props.reset('searchReportsForm');
    this.props.setSearch([]);
  }

  onSubmit(searchInput) {
    let options = _.pick(this.props, ['page', 'perPage']);
    options = _.merge(options, formatTags(searchInput.tags));
    this.props.setSearch(options.tags);
    return this.props.action(options);
  }

  render() {
    const hasTags = !_.isEmpty(this.props.values.tags);
    const cancelClass = hasTags ? 'cancelEnabled' : 'cancelHidden';
    return (
      <form
        onSubmit={this.props.handleSubmit(this.onSubmit)}
        className={`${styles.searchForm} form-control`}
      >
        <Field
          className={styles.searchField}
          placeholder="Search reports by tags"
          name="tags"
          type="text"
          component="input"
        />
        <button
          className={styles[cancelClass]}
          onClick={this.resetSearch}
          type="button"
        >X
        </button>
        <div className={styles.searchButton}>
          <Button type="submit" color="primary" text="Search" />
        </div>
      </form>
    );
  }
}

const mapStateToProps = state => ({
  values: state.form.searchReportsForm.values,
});

export default reduxForm({
  form: 'searchReportsForm',
  destroyOnUnmount: false,
})(connect(mapStateToProps, { reset })(SearchReports));
