import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import styles from './styles/CollapsibleItem.css';

export default function CollapsibleItem(props) {
  const [isOpen, setOpen] = useState(false);
  const { children, title } = props;

  useEffect(() => {
    setOpen(false);
  }, [title]);

  function handleClick() {
    if (!isOpen) {
      props.onExpand();
    }
    setOpen(!isOpen);
  }

  return (
    /* eslint-disable jsx-a11y/click-events-have-key-events */
    /* eslint-disable jsx-a11y/no-static-element-interactions */
    <div className={props.className} onClick={handleClick}>
      <div className={styles.collapsibleTitle}>{title}</div>
      {isOpen ? (
        <div className={styles.expandedDetails}>{children}</div>
      ) : (
        <div className={styles.collapsedDetails} />
      )}
    </div>
    /* eslint-enable jsx-a11y/click-events-have-key-events */
    /* eslint-enable jsx-a11y/no-static-element-interactions */
  );
}

CollapsibleItem.propTypes = {
  className: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.element,
  onExpand: PropTypes.func,
};

CollapsibleItem.defaultProps = {
  children: <div />,
  onExpand: () => {},
};
