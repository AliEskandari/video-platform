import React from "react";
import { Row, Col } from "react-bootstrap";
import VideoCard from "../components/video-card";
export default function Home() {
  return (
    <div>
      <Row xs={1} sm={2} md={2} lg={3} xl={5} className="g-4">
        {Array.from({ length: 40 }).map((_, idx) => (
          <Col>
            <VideoCard />
          </Col>
        ))}
      </Row>
    </div>
  );
}
