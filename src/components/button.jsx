import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Button as ButtonComponent } from 'reactstrap';
import omit from 'lodash/omit';

function Button(props) {
  const { history, to, onClick, children, ...rest } = props;

  function handleClick(event) {
    onClick(event);
    if (to) {
      history.push(to);
    }
  }

  return (
    <ButtonComponent {...omit(rest, 'staticContext')} onClick={handleClick}>
      {children}
    </ButtonComponent>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  onClick: PropTypes.func,
  to: PropTypes.string,
};

Button.defaultProps = {
  onClick: () => {},
  to: '',
};

export default withRouter(Button);
