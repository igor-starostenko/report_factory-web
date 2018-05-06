import React, { Component } from 'react';
import styles from './styles/CollapsibleItem.css';

export default class CollapsibleItem extends Component {
  constructor(props) {
    super(props);
    this.state = { expanded: false };
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillUpdate() {
    if (this.state.expanded) {
      this.setState({ expanded: false });
    }
  }

  handleClick() {
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    const className = this.state.expanded ? 'expandedDetails' : 'collapsedDetails';
    return (
      /* eslint-disable jsx-a11y/click-events-have-key-events */
      /* eslint-disable jsx-a11y/no-static-element-interactions */
      <div className={this.props.className} onClick={this.handleClick}>
        <div className={styles.collapsibleTitle}>{this.props.title}</div>
        <div className={styles[className]}>
          {this.props.details}
        </div>
      </div>
      /* eslint-enable jsx-a11y/click-events-have-key-events */
      /* eslint-enable jsx-a11y/no-static-element-interactions */
    );
  }
}
