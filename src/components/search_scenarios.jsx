import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import filter from 'lodash/filter';
import split from 'lodash/split';
import { Button } from 'reactstrap';
import styles from './styles/SearchBar.css';

const formatWords = string => {
  if (isEmpty(string)) {
    return [];
  }
  const words = split(string, ' ');
  return filter(words, word => !isEmpty(word));
};

export default function SearchScenarios(props) {
  const [inputValue, setInputValue] = useState('');
  const { search } = props;

  function handleSubmit(event) {
    event.preventDefault();
    props.setSearch(formatWords(inputValue));
  }

  function resetSearch() {
    props.setSearch([]);
    setInputValue('');
  }

  function updateInputValue(words) {
    setInputValue(words.target.value);
  }

  const hasSearchWords = !isEmpty(search) || inputValue;
  const cancelClass = hasSearchWords ? 'cancelEnabled' : 'cancelHidden';

  return (
    <form
      onSubmit={handleSubmit}
      className={`${styles.searchForm} form-control`}
    >
      <input
        className={styles.searchField}
        value={inputValue}
        onChange={updateInputValue}
        placeholder="Search for scenarios"
        name="words"
        type="text"
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

SearchScenarios.propTypes = {
  setSearch: PropTypes.func.isRequired,
  search: PropTypes.arrayOf(PropTypes.string).isRequired,
};
