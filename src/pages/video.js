import Plyr from "plyr";
import React, { useContext, useEffect, useState, useRef } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";
import VideoSearchResult from "../components/video-search-result";
import * as ROUTES from "../constants/routes";
import { format } from "date-fns";
import useVideo from "../hooks/use-video";
import useUser from "../hooks/use-user";
import SubscribeButton from "../components/subscribe-button";
import useSubscriptions from "../hooks/use-subscriptions";
import UserContext from "../context/user";
import useVideos from "../hooks/use-videos";
import useIsSubscribed from "../hooks/use-is-subscribed";
import useUserCanWatchVideo from "../hooks/use-user-can-watch-video";
import { userCanWatchVideo as userCanWatchVideoHelper } from "../helpers/helpers";

export default function Video() {
  const { user: loggedInUser } = useContext(UserContext);
  const { id: videoId } = useParams();
  const { video } = useVideo(videoId);
  const { user } = useUser(video?.userId);
  const { videos: relatedVideos } = useVideos({ user: user });
  const { subscriptions } = useSubscriptions(loggedInUser?.uid);
  const { isSubscribed, setIsSubscribed } = useIsSubscribed(
    subscriptions,
    video?.userId
  );
  const { userCanWatchVideo } = useUserCanWatchVideo(
    loggedInUser,
    isSubscribed,
    video
  );
  const player = useRef(null);

  useEffect(() => {
    if (video && userCanWatchVideo) {
      player.current.source = {
        type: "video",
        title: video.title,
        sources: [
          {
            src: video.url,
          },
        ],
      };
    }
  }, [video, userCanWatchVideo]);

  useEffect(() => {
    player.current = new Plyr("#player", { ratio: "16:9" });
  }, []);

  return (
    <Container>
      <Row>
        <Col sm={12} md={12} lg={8}>
          {/* Video */}
          <div className="mb-4">
            <div className={!userCanWatchVideo ? "d-none" : undefined}>
              <video id="player" className="w-100" playsInline controls></video>
            </div>
            {!userCanWatchVideo && (
              <div className="ratio ratio-16x9">
                <div className="text-primary bg-light fs-1 w-100 h-100 position-absolute d-flex align-items-center justify-content-center">
                  <i className="bi bi-lock"></i>
                </div>
              </div>
            )}
          </div>

          {/* Title */}
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

          {/* Channel */}
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
          <hr className="d-lg-none d-xl-none" />

          <Row xs={1} className="g-2">
            {relatedVideos?.map((video, idx) => (
              <Col key={idx}>
                <VideoSearchResult
                  userCanWatchVideo={userCanWatchVideoHelper(
                    loggedInUser,
                    isSubscribed,
                    video
                  )}
                  video={video}
                />
              </Col>
            ))}
            {!relatedVideos &&
              Array.from({ length: 10 }).map((_, idx) => (
                <Col key={idx}>
                  <VideoSearchResult />
                </Col>
              ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
