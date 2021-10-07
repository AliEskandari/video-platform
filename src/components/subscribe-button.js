import React, { useContext, useState, useEffect } from "react";
import { Button, OverlayTrigger, Popover } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import ModalContext from "../context/modal";
import UserContext from "../context/user";
import { subscribeToUser, unsubcribeFromUser } from "../services/firebase";
import * as ROUTES from "../constants/routes";

export default function SubscribeButton({
  channelUserId,
  isSubscribed,
  setIsSubscribed,
}) {
  const { user: loggedInUser } = useContext(UserContext);
  const { showModal } = useContext(ModalContext);
  const location = useLocation();

  const handleClick = (event) => {
    const subscribe = () => {
      const handleProceed = async () => {
        await subscribeToUser(loggedInUser.uid, channelUserId);
        setIsSubscribed(true);
      };
      showModal({ text: "Subscribe for 4.99?", handleProceed });
    };

    const unsubscribe = () => {
      const handleProceed = async () => {
        await unsubcribeFromUser(loggedInUser.uid, channelUserId);
        setIsSubscribed(false);
      };
      showModal({
        text: "Are you sure you want to unsubscribe?",
        handleProceed,
      });
    };
    isSubscribed ? unsubscribe() : subscribe();
  };

  const popover = (
    <Popover style={{ maxWidth: "400px" }}>
      <Popover.Body>
        <h6>Want to subscribe to this channel?</h6>
        <p>Sign in to subscribe to this channel.</p>
        <hr />
        <LinkContainer
          to={{
            pathname: ROUTES.SIGN_IN,
            state: { referrer: location.pathname },
          }}
        >
          <Button variant="outline-primary">Sign In</Button>
        </LinkContainer>
      </Popover.Body>
    </Popover>
  );

  return (
    <>
      {!loggedInUser ? (
        <>
          <OverlayTrigger
            trigger="click"
            placement="top-start"
            overlay={popover}
          >
            <Button variant="primary">Subscribe</Button>
          </OverlayTrigger>
        </>
      ) : (
        <>
          <Button
            variant={isSubscribed ? "outline-primary" : "primary"}
            className=""
            size=""
            onClick={handleClick}
          >
            {isSubscribed ? "Subscribed" : "Subscribe"}
          </Button>
        </>
      )}
    </>
  );
}
