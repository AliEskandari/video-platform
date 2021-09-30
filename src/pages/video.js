import Plyr from "plyr";
import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";
import VideoCard from "../components/video-card";
import * as ROUTES from "../constants/routes";
import ModalContext from "../context/modal";
import { getVideoById } from "../services/firebase";
import { format } from "date-fns";

export default function Video() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    const getVideoObj = async () => {
      const vid = await getVideoById(id);
      setVideo(vid);
      new Plyr("#player");
    };
    getVideoObj();
  }, []);

  const { handleShow } = useContext(ModalContext);

  return (
    <Container>
      <Row>
        {/* Video */}
        <Col sm={12} md={8} lg={8}>
          <div className="mb-4" style={{ minHeight: "480px" }}>
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
          <p>{video?.description || <Skeleton />}</p>
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
