import React from "react";
import { Row, Col, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import VideoCard from "../components/video-card";
export default function Channel() {
  return (
    <>
      <Row>
        {/* Profile Photo */}
        <Col md={6}>
          <Image
            className="mb-4"
            src="https://via.placeholder.com/1080x720"
            fluid
          ></Image>
        </Col>
        {/* Info */}
        <Col md={6}>
          <h2>Wally's Workouts</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque a
            lectus sit amet orci rhoncus pellentesque molestie mattis justo.
            Aenean quis felis interdum, auctor arcu at, imperdiet sapien.
            Praesent dictum sit amet nisl nec tempus.
          </p>

          <p>
            <b>Specialty:</b> Kickboxing
          </p>

          <p>
            <b>Country:</b> United States
          </p>

          <p className="fs-2 fst-italic fw-lighter">"Always give it 110%!"</p>
        </Col>
      </Row>

      <Row>
        <Col>
          <Row xs={1} md={3} lg={4} xl={5} className="g-4">
            {Array.from({ length: 20 }).map((_, idx) => (
              <Col>
                <VideoCard />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </>
  );
}
