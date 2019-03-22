import React, { useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { Field, reduxForm, reset } from 'redux-form';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import merge from 'lodash/merge';
import pick from 'lodash/pick';
import split from 'lodash/split';
import { Button } from 'reactstrap';
import styles from '../components/styles/SearchBar.css';

const formatTags = tags => {
  if (isEmpty(tags)) {
    return { tags: [] };
  }
  const noSpecialCharsString = tags.replace(/[^\-\w\s]/gi, '');
  return { tags: split(noSpecialCharsString, ' ') };
};

function SearchReports(props) {
  useEffect(
    () => () => {
      props.reset('searchReportsForm');
      props.setSearch([]);
    },
    [],
  );

  function onSubmit(searchInput) {
    let options = pick(props, ['page', 'perPage']);
    options = merge(options, formatTags(searchInput.tags));
    props.setSearch(options.tags);
    return props.action(options);
  }

  function resetSearch() {
    props.reset('searchReportsForm');
    onSubmit({ tags: [] });
  }

  const hasTags = !isEmpty(props.values.tags);
  const cancelClass = hasTags ? 'cancelEnabled' : 'cancelHidden';

  return (
    <form
      onSubmit={props.handleSubmit(onSubmit)}
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
        onClick={resetSearch}
        type="button"
      >
        X
      </button>
      <div className={styles.searchButton}>
        <Button type="submit" color="primary">
          Search
        </Button>
      </div>
    </form>
  );
}
SearchReports.propTypes = {
  values: PropTypes.shape({
    tags: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string,
    ]),
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  action: PropTypes.func.isRequired,
  setSearch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  values: state.form.searchReportsForm.values,
});

export default reduxForm({
  form: 'searchReportsForm',
  destroyOnUnmount: false,
})(
  connect(
    mapStateToProps,
    { reset },
  )(SearchReports),
);
