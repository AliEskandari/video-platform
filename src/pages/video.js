import React, { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Image, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import VideoCard from "../components/video-card";
import * as ROUTES from "../constants/routes";
import ModalContext from "../context/modal";
import { getVideoById } from "../services/firebase";
import Plyr from "plyr";

export default function Video() {
  const { id } = useParams();
  const [video, setVideo] = useState({});

  useEffect(() => {
    const getVideoObj = async () => {
      const vid = await getVideoById(id);
      setVideo(vid);
      const player = new Plyr("#player");
    };
    getVideoObj();
  }, []);

  const { handleShow } = useContext(ModalContext);

  return (
    <Container>
      <Row>
        {/* Video */}
        <Col sm={12} md={8} lg={8}>
          <div className="mb-4">
            <video id="player" playsInline controls>
              <source src={video.url} />
            </video>
          </div>
          {/* <Image
            className="mb-4"
            src="https://via.placeholder.com/1080x720"
            fluid
          ></Image> */}
          <h4>{video.title || "New Workout!"}</h4>
          <p>{video.views || "145,918"} views • Sep 15, 2021</p>
          <hr />
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <Link
                to={ROUTES.CHANNEL.replace(":id", 1)}
                className="text-reset text-decoration-none"
              >
                <h5 className="mb-0">Wally's Workouts</h5>
              </Link>
              <small>100K subscribers</small>
            </div>
            <Button
              variant="primary"
              className=""
              size="sm"
              onClick={() => handleShow("Subscribe for 4.99?")}
            >
              Subscribe
            </Button>
          </div>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque a
            lectus sit amet orci rhoncus pellentesque molestie mattis justo.
            Aenean quis felis interdum, auctor arcu at, imperdiet sapien.
            Praesent dictum sit amet nisl nec tempus. Ut vel malesuada turpis.
            Aliquam varius eros leo, ut placerat urna scelerisque quis. Morbi
            orci est, porttitor sit amet risus eget, sagittis mattis diam. Nam
            est ante, finibus sit amet purus porttitor, aliquam hendrerit orci.
            Vestibulum fermentum accumsan erat, nec feugiat dolor tempor ac.
            Vivamus dictum hendrerit faucibus. Vivamus posuere mi purus, non
            rutrum lacus aliquet facilisis.
          </p>
        </Col>
        {/* Related Videos */}
        <Col>
          <hr />
          <Row xs={1} className="g-2">
            {Array.from({ length: 10 }).map((_, idx) => (
              <Col key={idx}>
                <VideoCard />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
