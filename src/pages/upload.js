import React, { useContext, useRef } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { uploadFile } from "../services/firebase";
import { useHistory } from "react-router-dom";
import UserContext from "../context/user";
import * as ROUTES from "../constants/routes";

// Alert
import AlertContext from "../context/alert";

export default function Upload() {
  const history = useHistory();
  const { user: loggedInUser } = useContext(UserContext);
  const { setAlert } = useContext(AlertContext);
  const fileInput = useRef("");

  const handlePublish = (event) => {
    event.preventDefault();

    const file = fileInput.current.files[0];
    uploadFile(loggedInUser.uid, file, setAlert);

    history.push(ROUTES.PROFILE);
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={8} xl={6} className="border-3">
          <Form>
            <div className="mb-3 d-flex justify-content-between align-items-center">
              <h2 className="mb-0 lh-base">New Video</h2>
              <Button variant="primary" type="submit" onClick={handlePublish}>
                PUBLISH
              </Button>
            </div>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>File</Form.Label>
              <Form.Control
                type="file"
                ref={fileInput}
                accept="video/mp4, video/mpeg, video/quicktime"
              />
              <Form.Text id="" muted></Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" placeholder="Enter video title" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter video description"
              />
            </Form.Group>
            <Form.Group className="pb-3">
              <Form.Check type="switch" id="" label="Exclusive" />
              <Form.Text id="" muted>
                Activate to make video visible only to your subscribers.
              </Form.Text>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
