import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import * as ROUTES from "../constants/routes";
import Skeleton from "react-loading-skeleton";
import { formatDistanceToNow } from "date-fns";
import "./video-card.css";

export default function VideoCard({ video, showUserName = true }) {
  return (
    <Card className="border-0">
      <Link className="card-img" to={ROUTES.VIDEO.replace(":id", video?.docId)}>
        {video?.thumbnail ? (
          <Card.Img variant="top" src={video.thumbnail} />
        ) : (
          <Skeleton
            className="img card-img-top img-fluid"
            width="100%"
            style={{ paddingTop: "56.25%" }}
          />
        )}
      </Link>
      <Card.Body className="px-0">
        <Card.Title className="text-truncate fs-6">
          <Link
            to={ROUTES.VIDEO.replace(":id", video?.docId)}
            className="text-reset text-decoration-none"
          >
            {video?.title || <Skeleton width="80%" />}
          </Link>
        </Card.Title>

        <Card.Text className="text-muted">
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
            <>
              <Skeleton width="90%" />
            </>
          )}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
