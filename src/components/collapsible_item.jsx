import React, { Component } from 'react';
import _ from 'lodash';
import styles from './styles/CollapsibleItem.css';

export default class CollapsibleItem extends Component {
  constructor(props) {
    super(props);
    this.state = { expanded: false };
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillUpdate(nextProps) {
    if (!_.isEqual(this.props.title, nextProps.title)) {
      if (this.state.expanded) {
        this.setState({ expanded: false });
      }
    }
  }

  expandedDetails() {
    if (this.state.expanded) {
      return (
        <div className={styles.expandedDetails}>
          {this.props.details || this.props.renderDetails()}
        </div>
      );
    }
    return <div className={styles.collapsedDetails} />;
  }

  handleClick() {
    if (this.props.onExpand && !this.state.expanded) {
      this.props.onExpand();
    }
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    return (
      /* eslint-disable jsx-a11y/click-events-have-key-events */
      /* eslint-disable jsx-a11y/no-static-element-interactions */
      <div className={this.props.className} onClick={this.handleClick}>
        <div className={styles.collapsibleTitle}>{this.props.title}</div>
        {this.expandedDetails()}
      </div>
      /* eslint-enable jsx-a11y/click-events-have-key-events */
      /* eslint-enable jsx-a11y/no-static-element-interactions */
    );
  }
}
