import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import VideoCard from "../components/video-card";

export default function search() {
  return (
    <Container>
      <Row xs={1} sm={2} md={2} lg={3} xl={5} className="g-2">
        {Array.from({ length: 40 }).map((_, idx) => (
          <Col key={idx}>
            <VideoCard />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
