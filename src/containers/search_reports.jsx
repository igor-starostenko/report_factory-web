import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Button, FormField } from '../components';

const formatTags = (tags) => {
  if (_.isEmpty(tags)) {
    return { tags: null };
  }
  const noSpecialCharsString = tags.replace(/[^\w\s]/gi, '');
  return { tags: _.split(noSpecialCharsString, ' ') };
};

class SearchReports extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(searchInput) {
    let options = _.pick(this.props, ['page', 'perPage']);
    options = _.merge(options, formatTags(searchInput.tags));
    return this.props.action(options);
  }

  render() {
    return (
      <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
        <Field
          placeholder="Search reports by tags"
          name="tags"
          type="text"
          component={FormField}
        />
        <div className="formButtons">
          <Button type="submit" color="primary" text="Search" />
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'SearchReportsForm',
})(connect()(SearchReports));
