import React from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";

export default function Contact() {
  return (
    <Container>
      <Row
        className="mb-4 d-flex justify-content-center"
        style={{ height: "90%" }}
      >
        <Col md={6}>
          <h1 className="text-center mb-4">Contact us</h1>
          <p class="mb-5 text-center">
            Do you have any questions? Please do not hesitate to contact us
            directly. Our team will come back to you within a matter of hours to
            help you.
          </p>
          <Col>
            <Form id="contact-form" name="contact-form">
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Your name</Form.Label>
                    <Form.Control type="text" placeholder="Enter your name" />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Subject</Form.Label>
                    <Form.Control type="text" placeholder="Subject" />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Your Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter your message"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
            <div class="text-center text-md-left">
              <Button>Send</Button>
            </div>
            <div class="status"></div>
          </Col>
        </Col>
      </Row>
    </Container>
  );
}
