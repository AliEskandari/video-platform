import React from "react";
import { Image, Row, Col } from "react-bootstrap";

export default function Profile() {
  return (
    <Row>
      {/* Profile Photo */}
      <Col md={6}>
        <Image
          className="mb-4"
          src="https://via.placeholder.com/1080x720"
          fluid
        ></Image>
      </Col>
    </Row>
  );
}
