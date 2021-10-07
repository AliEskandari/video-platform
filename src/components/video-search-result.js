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
  userCanWatchVideo,
}) {
  let videoUrl = ROUTES.VIDEO.replace(":id", video?.docId);

  return (
    <Row className="border-0">
      {!video ? (
        <>
          <Col>
            <div className="ratio ratio-16x9">
              <Skeleton className="img lh-base" height="100%" width="100%" />
            </div>
          </Col>
          <Col>
            <h6>
              <Skeleton width="80%" />
            </h6>

            {showUserName && (
              <>
                <Skeleton width="50%" />
                <br />
              </>
            )}
            <Skeleton width="90%" />
          </Col>
        </>
      ) : (
        <>
          {/* Thumbnail */}
          <Col>
            <Link className="" to={videoUrl}>
              <div className="ratio ratio-16x9">
                {userCanWatchVideo ? (
                  <Card.Img
                    variant="top"
                    style={{ objectFit: "cover" }}
                    src={video.thumbUrl}
                  />
                ) : (
                  <div className="bg-light">
                    <div className="w-100 h-100 position-absolute d-flex align-items-center justify-content-center">
                      <i className="bi bi-lock text-primary fs-1"></i>
                    </div>
                  </div>
                )}
              </div>
            </Link>
          </Col>
          {/* Info */}
          <Col>
            <h6>
              <Link to={videoUrl} className="text-reset text-decoration-none">
                {video?.exclusive && (
                  <i class="bi bi-lock pe-1 text-primary"></i>
                )}
                {video.title}
              </Link>
            </h6>
            {showUserName && (
              <>
                <Link to={videoUrl} className="text-reset text-decoration-none">
                  {video.userName}
                </Link>
                <br />
              </>
            )}
            {video.views} views • {formatDistanceToNow(video.dateCreated)} ago
          </Col>
        </>
      )}
    </Row>
  );
}
