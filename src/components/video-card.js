import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import * as ROUTES from "../constants/routes";
import "./video-card.css";
import Skeleton from "react-loading-skeleton";
import { Route } from "react-router-dom/cjs/react-router-dom.min";

export default function VideoCard() {
  return (
    <Card className="border-0">
      <Link className="card-img" to={ROUTES.VIDEO.replace(":id", 1)}>
        {/* <Skeleton duration={100} className="img card-img-top" /> */}
        <Card.Img variant="top" src="https://via.placeholder.com//160x100" />
      </Link>
      <Card.Body className="ps-0">
        <div className="d-flex justify-content-between">
          <Card.Title className="text-truncate">
            <Link
              to={ROUTES.VIDEO.replace(":id", 1)}
              className="text-reset text-decoration-none"
            >
              New Workout Video
            </Link>
          </Card.Title>
          <Link
            to={ROUTES.EDIT_VIDEO}
            className="edit-button float-end d-none text-black-50"
          >
            <i className="bi bi-pencil-fill"></i>
          </Link>
        </div>

        <Card.Text>
          <Link
            to={ROUTES.CHANNEL.replace(":id", 1)}
            className="text-reset text-decoration-none"
          >
            Channel X
          </Link>
        </Card.Text>
        <Card.Text>200k views • 3 days ago</Card.Text>
      </Card.Body>
    </Card>
  );
}
