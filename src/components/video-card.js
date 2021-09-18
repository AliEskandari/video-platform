import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import * as ROUTES from "../constants/routes";

export default function VideoCard() {
  return (
    <Card className="border-0">
      <Link to={ROUTES.VIDEO.replace(":id", 1)}>
        <Card.Img variant="top" src="https://via.placeholder.com//160x100" />
      </Link>
      <Card.Body className="ps-0">
        <Card.Title>
          <Link
            to={ROUTES.VIDEO.replace(":id", 1)}
            className="text-reset text-decoration-none"
          >
            New Workout Video
          </Link>
        </Card.Title>
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
