import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import { Collapse } from 'reactstrap';
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
    <div
      className={props.className}
      onClick={handleClick}
      role="menuitem"
      tabIndex={0}
    >
      <div className={styles.collapsibleTitle}>{title}</div>
      <Collapse isOpen={isOpen}>
        <div className={styles.expandedDetails}>{children}</div>
      </Collapse>
    </div>
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
