import React, { useContext, useState, useEffect } from "react";
import { Button, Col, Container, Image, Row } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import VideoCard from "../components/video-card";
import useUser from "../hooks/use-user";
import useVideos from "../hooks/use-videos";
import useSubscriptions from "../hooks/use-subscriptions";
import UserContext from "../context/user";
import SubscribeButton from "../components/subscribe-button";
import useIsSubscribed from "../hooks/use-is-subscribed";
import { userCanWatchVideo } from "../helpers/helpers";

export default function Channel() {
  const { id: userId } = useParams();
  const { user: loggedInUser } = useContext(UserContext);
  const { user } = useUser(userId);
  const { subscriptions } = useSubscriptions(loggedInUser?.uid);
  const { isSubscribed, setIsSubscribed } = useIsSubscribed(
    subscriptions,
    userId
  );

  const { videos } = useVideos({ user });

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
            <SubscribeButton
              isSubscribed={isSubscribed}
              setIsSubscribed={setIsSubscribed}
              channelUserId={userId}
            />
          </div>
          <p>{user?.bio || <Skeleton />}</p>

          <p>
            <span>Specialty:</span> {user?.specialty}
          </p>

          <p>
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
                  userCanWatchVideo={userCanWatchVideo(
                    loggedInUser,
                    isSubscribed,
                    video
                  )}
                  video={video}
                  showUserName={false}
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
