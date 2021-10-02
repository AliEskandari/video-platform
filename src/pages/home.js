import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import VideoCard from "../components/video-card";
import useVideos from "../hooks/use-videos";
export default function Home() {
  const { videos } = useVideos({ all: true });
  return (
    <Container>
      <Row xs={1} sm={2} md={2} lg={3} xl={5} className="g-2">
        {videos.map((video, idx) => (
          <Col key={idx}>
            <VideoCard video={video} />
          </Col>
        ))}
        {!videos.length &&
          Array.from({ length: 40 }).map((_, idx) => (
            <Col key={idx}>
              <VideoCard />
            </Col>
          ))}
      </Row>
    </Container>
  );
}
