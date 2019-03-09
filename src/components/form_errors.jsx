import React from 'react';
import { PropTypes } from 'prop-types';
import { ListGroup, ListGroupItem } from 'reactstrap';
import styles from './styles/FormErrors.css';

export default function FormErrors(props) {
  const { errors } = props;

  return (
    <ListGroup className={styles.errors}>
      {(errors || []).map(({ detail }, index) => {
        return (
          // eslint-disable-next-line react/no-array-index-key
          <ListGroupItem key={index} color="danger">
            {detail}
          </ListGroupItem>
        );
      })}
    </ListGroup>
  );
}

FormErrors.propTypes = {
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      detail: PropTypes.string,
    }).isRequired,
  ),
};

FormErrors.defaultProps = {
  errors: [],
};
