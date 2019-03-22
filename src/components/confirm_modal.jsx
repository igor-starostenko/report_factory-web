import React, { Fragment } from 'react';
import { PropTypes } from 'prop-types';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default function ConfirmModal(props) {
  const { toggle, isOpen, children, title, cancel, submit } = props;

  return (
    <Modal toggle={toggle} isOpen={isOpen}>
      <ModalHeader toggle={toggle}>{title}</ModalHeader>
      <ModalBody>{children}</ModalBody>
      <ModalFooter>
        <Button color="link" onClick={toggle} {...cancel} />
        {submit.children && (
          <Fragment>
            <div className="divider" />
            <Button type="submit" {...submit} />
          </Fragment>
        )}
      </ModalFooter>
    </Modal>
  );
}

ConfirmModal.propTypes = {
  toggle: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  submit: PropTypes.shape({
    onClick: PropTypes.func.isRequired,
    children: PropTypes.string.isRequired,
  }),
  cancel: PropTypes.shape({
    children: PropTypes.string.isRequired,
  }),
};

ConfirmModal.defaultProps = {
  submit: {
    onClick: () => {},
    children: '',
  },
  cancel: {
    children: 'Ok',
  },
};
