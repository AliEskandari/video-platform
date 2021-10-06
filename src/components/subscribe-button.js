import React, { useContext, useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import ModalContext from "../context/modal";
import UserContext from "../context/user";
import { subscribeToUser, unsubcribeFromUser } from "../services/firebase";

export default function SubscribeButton({
  channelUserId,
  isSubscribed,
  setIsSubscribed,
}) {
  const { user: loggedInUser } = useContext(UserContext);
  const { showModal } = useContext(ModalContext);

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

  return (
    <Button
      variant={isSubscribed ? "outline-primary" : "primary"}
      className=""
      size=""
      onClick={handleClick}
    >
      {isSubscribed ? "Subscribed" : "Subscribe"}
    </Button>
  );
}
