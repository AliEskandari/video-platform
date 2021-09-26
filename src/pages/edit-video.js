import { useContext } from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import ModalContext from "../context/modal";

export default function EditVideo() {
  const { handleShow } = useContext(ModalContext);

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={8} xl={6} className="border-3">
          <Form>
            <div className="mb-3 d-flex justify-content-between align-items-center">
              <h2 className="mb-0 lh-base">Edit Video</h2>
              <Button
                variant="primary"
                className="text-uppercase"
                size="sm"
                type="submit"
              >
                Save
              </Button>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value="New Workout Video"
                placeholder="Enter video title"
              />
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
          <hr />

          <div className="mb-3 d-flex justify-content-between align-items-center">
            <Button size="sm" variant="danger" onClick={handleShow}>
              DELETE VIDEO
            </Button>
            <h2></h2>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
