import Plyr from "plyr";
import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";
import VideoCard from "../components/video-card";
import * as ROUTES from "../constants/routes";
import { format } from "date-fns";
import useVideo from "../hooks/use-video";
import useUser from "../hooks/use-user";
import SubscribeButton from "../components/subscribe-button";
import useSubscriptions from "../hooks/use-subscriptions";
import UserContext from "../context/user";

export default function Video() {
  const { user: loggedInUser } = useContext(UserContext);
  const { id: videoId } = useParams();
  const { video } = useVideo(videoId);
  const { user } = useUser(video?.userId);
  const { subscriptions } = useSubscriptions(loggedInUser.uid);
  const [isSubscribed, setIsSubscribed] = useState();

  useEffect(() => {
    setIsSubscribed(subscriptions?.includes(video?.userId));
  }, [subscriptions, video]);

  useEffect(() => {
    if (video) {
      new Plyr("#player");
    }
  }, [video]);

  return (
    <Container>
      <Row>
        {/* Video */}
        <Col sm={12} md={12} lg={8}>
          <div className="mb-4">
            <video id="player" className="w-100" playsInline controls>
              <source src={video?.url} />
            </video>
          </div>

          <h4>{video?.title || <Skeleton width={800} />}</h4>
          {video ? (
            <p>
              {video.views.toString()} views •{" "}
              {format(video.dateCreated, "MMM dd, yyyy")}
            </p>
          ) : (
            <p>
              <Skeleton width={400} />
            </p>
          )}

          <hr />
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <Link
                to={ROUTES.CHANNEL.replace(":id", video?.userId)}
                className="text-reset text-decoration-none"
              >
                <h5 className="mb-0">{user?.name || <Skeleton />}</h5>
              </Link>
              <small>
                {user ? `${user.subscriberCount} subscribers` : <Skeleton />}
              </small>
            </div>
            <SubscribeButton
              isSubscribed={isSubscribed}
              setIsSubscribed={setIsSubscribed}
              channelUserId={video?.userId}
            />
          </div>
          <p>{video?.description || " " || <Skeleton height={100} />}</p>
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
