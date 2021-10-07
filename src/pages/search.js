import React, { useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import VideoCard from "../components/video-card";
import useVideos from "../hooks/use-videos";
import useQuery from "../hooks/use-query";
import useSubscriptions from "../hooks/use-subscriptions";
import UserContext from "../context/user";
import { userCanWatchVideo, isSubscribed } from "../helpers/helpers";

export default function Search() {
  const { query } = useQuery();
  const { user: loggedInUser } = useContext(UserContext);
  const { subscriptions } = useSubscriptions(loggedInUser.uid);
  const { videos } = useVideos({ searchQuery: query });
  return (
    <Container>
      <Row xs={1} sm={2} md={2} lg={3} xl={5} className="g-2">
        {videos?.map((video, idx) => (
          <Col key={idx}>
            <VideoCard
              video={video}
              userCanWatchVideo={userCanWatchVideo(
                loggedInUser,
                isSubscribed(subscriptions, video.userId),
                video
              )}
            />
          </Col>
        ))}
        {!videos &&
          Array.from({ length: 40 }).map((_, idx) => (
            <Col key={idx}>
              <VideoCard />
            </Col>
          ))}
      </Row>
    </Container>
  );
}
