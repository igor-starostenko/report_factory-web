import React, { Component } from 'react';
import _ from 'lodash';
import { Button } from '../components';
import styles from './styles/SearchBar.css';

const formatWords = (string) => {
  if (_.isEmpty(string)) {
    return [];
  }
  const words = _.split(string, ' ');
  return _.filter(words, (word) => !_.isEmpty(word));
};

export default class SearchScenarios extends Component {
  constructor(props) {
    super(props);
    this.state = { inputValue: '' }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.resetSearch = this.resetSearch.bind(this);
    this.updateInputValue = this.updateInputValue.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault()
    this.props.action({ search: formatWords(this.state.inputValue) });
  }

  resetSearch() {
    this.props.action({ search: [] });
    this.setState({ inputValue: '' });
  }

  updateInputValue(words) {
    this.setState({ inputValue: words.target.value });
  }

  render() {
    const hasSearchWords = !_.isEmpty(this.props.search) || this.state.inputValue;
    const cancelClass = hasSearchWords ? 'cancelEnabled' : 'cancelHidden';
    return (
      <form
        onSubmit={this.handleSubmit}
        className={`${styles.searchForm} form-control`}
      >
        <input
          className={styles.searchField}
          value={this.state.inputValue}
          onChange={this.updateInputValue}
          placeholder="Search for scenarios"
          name="words"
          type="text"
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
