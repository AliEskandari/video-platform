import React from "react";
import { Modal as BModal, Button, Row, Container } from "react-bootstrap";

export default function Modal({ show, handleClose }) {
  return (
    <BModal show={show} onHide={handleClose} centered size="sm">
      <Container className="">
        <Row className="p-3">
          <h2 className="text-center mb-4">Are you sure?</h2>
          <div className="d-flex justify-content-center">
            <Button
              variant="secondary"
              className="me-3"
              onClick={handleClose}
              size="lg"
            >
              No
            </Button>
            <Button variant="danger" size="lg">
              Yes
            </Button>
          </div>
        </Row>
      </Container>
    </BModal>
  );
}
