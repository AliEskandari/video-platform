import React from "react";
import { Row, Col, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import VideoCard from "../components/video-card";
export default function Video() {
  return (
    <Row>
      {/* Video */}
      <Col sm={12} lg={9}>
        <Image
          className="mb-4"
          src="https://via.placeholder.com/1080x720"
          fluid
        ></Image>

        <p>
          <h3>New Workout!</h3>
          145,918 views • Sep 15, 2021
        </p>

        <hr />

        <p>
          <Link to="/channel/1" className="text-reset text-decoration-none">
            <h5 className="mb-0">Wally's Workouts</h5>
          </Link>
          <small>100K subscribers</small>
        </p>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque a
          lectus sit amet orci rhoncus pellentesque molestie mattis justo.
          Aenean quis felis interdum, auctor arcu at, imperdiet sapien. Praesent
          dictum sit amet nisl nec tempus. Ut vel malesuada turpis. Aliquam
          varius eros leo, ut placerat urna scelerisque quis. Morbi orci est,
          porttitor sit amet risus eget, sagittis mattis diam. Nam est ante,
          finibus sit amet purus porttitor, aliquam hendrerit orci. Vestibulum
          fermentum accumsan erat, nec feugiat dolor tempor ac. Vivamus dictum
          hendrerit faucibus. Vivamus posuere mi purus, non rutrum lacus aliquet
          facilisis.
        </p>
      </Col>
      {/* Related Videos */}
      <Col>
        <Row xs={1} className="g-4">
          {Array.from({ length: 10 }).map((_, idx) => (
            <Col>
              <VideoCard />
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );
}
