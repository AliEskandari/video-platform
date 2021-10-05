import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import * as ROUTES from "../constants/routes";
import Skeleton from "react-loading-skeleton";
import { formatDistanceToNow } from "date-fns";
import "./video-card.css";

export default function VideoCard({
  video,
  showUserName = true,
  showEditButton = false,
}) {
  return (
    <Card className="border-0">
      <Link className="card-img" to={ROUTES.VIDEO.replace(":id", video?.docId)}>
        <div className="ratio ratio-16x9">
          {video?.exclusive && (
            <div className="bg-light">
              <div className="text-primary fs-1 w-100 h-100 position-absolute d-flex align-items-center justify-content-center">
                <i class="bi bi-lock"></i>
              </div>
            </div>
          )}

          {!video?.exclusive && video?.thumbUrl && (
            <Card.Img
              variant="top"
              style={{ objectFit: "cover" }}
              src={video.thumbUrl}
            />
          )}
          {!video?.exclusive && !video?.thumbUrl && (
            <Skeleton
              className="img card-img-top lh-base"
              height="100%"
              width="100%"
            />
          )}
        </div>
      </Link>
      {showEditButton && (
        <div className="card-img-overlay position-absolute w-100 h-100 pe-none">
          <Link
            to={ROUTES.EDIT_VIDEO.replace(":id", video?.docId)}
            className="edit-button float-end pe-auto d-none text-white py-1 px-2 bg-black bg-opacity-50 rounded-2"
          >
            <i className="bi bi-pencil-fill"></i>
          </Link>
        </div>
      )}
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
