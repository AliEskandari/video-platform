import React, { useContext } from "react";
import { Button, Col, Container, Image, Row } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import VideoCard from "../components/video-card";
import ModalContext from "../context/modal";
import useUser from "../hooks/use-user";
import useVideos from "../hooks/use-videos";

export default function Channel() {
  const { id: userId } = useParams();
  const { user } = useUser(userId);
  const { videos } = useVideos({ user });
  const { handleShow } = useContext(ModalContext);

  return (
    <Container>
      <Row className="mb-4">
        {/* Profile Photo */}
        <Col lg={4}>
          <Image
            className="mb-2"
            src="https://via.placeholder.com/1080x720"
            fluid
          ></Image>
        </Col>
        {/* Info */}
        <Col lg={8}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <span className="fs-1">{user?.name || <Skeleton />}</span>
            <Button
              variant="primary"
              className=""
              size="sm"
              onClick={() => handleShow("Subscribe for $4.99?")}
            >
              Subscribe
            </Button>
          </div>
          <p>{user?.bio || <Skeleton />}</p>

          <p>
            <b>Specialty:</b> {user?.speciality}
          </p>

          <p>
            <b>Country:</b> {user?.country}
          </p>

          <p className="fs-2 fst-italic fw-lighter">{user?.motivatement}</p>
        </Col>
      </Row>

      <Row>
        <Col>
          <Row xs={1} md={3} lg={4} xl={5} className="g-2">
            {videos.map((video, idx) => (
              <Col>
                <VideoCard video={video} showUserName={false} />
              </Col>
            ))}
            {!videos.length &&
              Array.from({ length: 20 }).map((_, idx) => (
                <Col>
                  <VideoCard showUserName={false} />
                </Col>
              ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
