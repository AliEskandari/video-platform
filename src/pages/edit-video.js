import { useContext, useState, useEffect } from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import ModalContext from "../context/modal";
import useVideo from "../hooks/use-video";
import { deleteUserVideo, updateVideo } from "../services/firebase";
import * as ROUTES from "../constants/routes";

export default function EditVideo() {
  const history = useHistory();
  const { id: videoId } = useParams();
  const { video } = useVideo(videoId);
  const { showModal } = useContext(ModalContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [exclusive, setExclusive] = useState(false);

  useEffect(() => {
    if (video) {
      setTitle(video.title || "");
      setDescription(video.description || "");
      setExclusive(video.exclusive || false);
    }
  }, [video]);

  const handleDeleteVideo = (event) => {
    event.preventDefault();
    const handleProceed = async () => {
      await deleteUserVideo(video);
      history.push(ROUTES.PROFILE);
    };
    showModal({ text: "Are you sure?", handleProceed });
  };

  const handleUpdateVideo = async (event) => {
    event.preventDefault();
    await updateVideo(video.id, { title, description, exclusive });
    history.push(ROUTES.PROFILE);
  };
  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={8} xl={5} className="border-3">
          <Form onSubmit={handleUpdateVideo}>
            <div className="mb-3 d-flex justify-content-between align-items-center">
              <h2 className="mb-0">Edit video</h2>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                required
                placeholder="Enter video title"
                onChange={({ target }) => setTitle(target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={({ target }) => setDescription(target.value)}
                placeholder="Enter video description"
              />
            </Form.Group>
            <Form.Group className="pb-3">
              <Form.Check
                type="switch"
                value={exclusive}
                onChange={({ target }) => setExclusive(target.value)}
                id=""
                label="Exclusive"
              />
              <Form.Text id="" muted>
                Activate to make video visible only to your subscribers.
              </Form.Text>
            </Form.Group>
            <Button
              variant="primary"
              className="float-end"
              size=""
              type="submit"
            >
              Save
            </Button>
            <Button
              size=""
              className="float-end mx-2"
              variant="outline-primary"
              onClick={handleDeleteVideo}
            >
              Delete
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
