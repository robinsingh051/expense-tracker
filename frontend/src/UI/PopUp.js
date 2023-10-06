import React from "react";
import { Modal } from "react-bootstrap";

const PopUp = ({ show, onClose, children }) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Dialog style={{ padding: "1rem", margin: "1rem" }}>
        {children}
      </Modal.Dialog>
    </Modal>
  );
};

export default PopUp;
