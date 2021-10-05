import React, { useContext, useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Container, Button, Image, Row, Col } from "react-bootstrap";
import VideoCard from "../components/video-card";
import * as ROUTES from "../constants/routes";
import useVideos from "../hooks/use-videos";
import UserContext from "../context/user";
import useUser from "../hooks/use-user";
import PubSub from "pubsub-js";

export default function Profile() {
  const { user: loggedInUser } = useContext(UserContext);
  const { user } = useUser(loggedInUser.uid);
  const { videos, reload } = useVideos({ user });

  useEffect(() => {
    if (reload) {
      const onUploadDone = (msg, data) => reload();
      const token = PubSub.subscribe("UPLOAD_DONE", onUploadDone);
      return () => {
        PubSub.unsubscribe(token);
      };
    }
  }, [reload]);

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
            <span className="fs-1">{loggedInUser.displayName}</span>
            <LinkContainer to={ROUTES.SETTINGS}>
              <Button variant="outline-primary" className="" size="">
                <i className="bi bi-gear"></i>
                <span className="ms-2">Edit Profile</span>
              </Button>
            </LinkContainer>
          </div>
          <p>
            {user?.bio}
            <br />
            <span>Specialty:</span> {user?.specialty}
            <br />
            <span>Country:</span> {user?.country}
          </p>

          <p className="fs-2 fst-italic fw-lighter">{user?.motivatement}</p>
        </Col>
      </Row>

      <Row>
        <Col>
          <Row xs={1} md={3} lg={4} xl={5} className="g-2">
            {videos?.map((video, idx) => (
              <Col key={idx}>
                <VideoCard
                  video={video}
                  showUserName={false}
                  showEditButton={true}
                />
              </Col>
            ))}

            {!videos &&
              Array.from({ length: 20 }).map((_, idx) => (
                <Col key={idx}>
                  <VideoCard showUserName={false} />
                </Col>
              ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
