import React from "react";
import { Row, Form, Button, Col, FloatingLabel } from "react-bootstrap";

export default function Upload() {
  return (
    <Row className="justify-content-center">
      <Col xs={12} md={8} xl={6} className="border-3">
        <Form>
          <div className="mb-3 d-flex justify-content-between align-items-center">
            <h2 className="mb-0 lh-base">New Video</h2>
            <Button variant="primary" type="submit">
              PUBLISH
            </Button>
          </div>

          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>File</Form.Label>
            <Form.Control type="file" />
            <Form.Text id="" muted></Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control type="text" placeholder="Enter video title" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter video description"
            />
          </Form.Group>

          <Form.Group className="pb-3">
            <Form.Check type="switch" id="" label="Exclusive" />
            <Form.Text id="" muted>
              Activate to make video visible only to your subscribers.
            </Form.Text>
          </Form.Group>
        </Form>
      </Col>
    </Row>
  );
}
