import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import * as ROUTES from "../constants/routes";
import Skeleton from "react-loading-skeleton";
import { formatDistanceToNow } from "date-fns";
import "./video-card.css";

export default function VideoSearchResult({
  video,
  showUserName = true,
  showEditButton = false,
  isSubscribed,
}) {
  let image = null;
  if (!video?.thumbUrl) {
    image = <Skeleton className="img lh-base" height="100%" width="100%" />;
  } else if (!video?.exclusive || isSubscribed) {
    image = (
      <Card.Img
        variant="top"
        style={{ objectFit: "cover" }}
        src={video.thumbUrl}
      />
    );
  } else {
    image = (
      <div className="bg-light">
        <div className="text-primary fs-1 w-100 h-100 position-absolute d-flex align-items-center justify-content-center">
          <i className="bi bi-lock"></i>
        </div>
      </div>
    );
  }

  return (
    <Row className="border-0">
      <Col>
        <Link className="" to={ROUTES.VIDEO.replace(":id", video?.docId)}>
          <div className="ratio ratio-16x9">{image}</div>
        </Link>
      </Col>
      <Col>
        <h6>
          <Link
            to={ROUTES.VIDEO.replace(":id", video?.docId)}
            className="disabled text-reset text-decoration-none"
          >
            {video?.title || <Skeleton width="80%" />}
          </Link>
        </h6>

        {showUserName && (
          <>
            <Link
              to={ROUTES.CHANNEL.replace(":id", video?.userId)}
              className="text-reset text-decoration-none"
            >
              {video?.userName || <Skeleton width="50%" />}
            </Link>
            <br />
          </>
        )}

        {video ? (
          <>
            {video.views} views • {formatDistanceToNow(video.dateCreated)} ago
          </>
        ) : (
          <Skeleton width="90%" />
        )}
      </Col>
    </Row>
  );
}
