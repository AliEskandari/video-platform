import React from "react";
import { Container, Row, Form, Button, Col } from "react-bootstrap";

export default function Settings() {
  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={8} xl={6} className="border-3">
          <Form>
            <div className="mb-3 d-flex justify-content-between align-items-center">
              <h2 className="mb-0 lh-base">Profile</h2>
              <Button variant="primary" type="submit">
                SAVE
              </Button>
            </div>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter channel name" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Describe your channel"
              />
            </Form.Group>
            <Row>
              <Form.Group as={Col} className="mb-3">
                <Form.Label>Country</Form.Label>
                <Form.Control type="text" placeholder="Country" />
              </Form.Group>
              <Form.Group as={Col} className="mb-3">
                <Form.Label>Specialty</Form.Label>
                <Form.Control type="text" placeholder="Ex. Cardio" />
              </Form.Group>
            </Row>
            <Form.Group className="pb-3">
              <Form.Label>Motivatement</Form.Label>
              <Form.Control type="text" placeholder="Give it 110%!" />
            </Form.Group>
          </Form>
          <hr />
          <Row>
            <div className="mb-3 d-flex justify-content-between align-items-center">
              <h2 className="mb-0 lh-base">Account</h2>
              <Button variant="primary" type="submit">
                SAVE
              </Button>
            </div>
            <Form.Group as={Col} className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>
            <Form.Group as={Col} className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
