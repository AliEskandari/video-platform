import { useState, useEffect } from "react";
import { isSubscribed as isSubScribedHelper } from "../helpers/helpers";

export default function useIsSubscribed(subscriptions, channelUserId) {
  const [isSubscribed, setIsSubscribed] = useState();

  useEffect(() => {
    if (subscriptions && channelUserId) {
      setIsSubscribed(isSubScribedHelper(subscriptions, channelUserId));
    }
  }, [subscriptions, channelUserId]);

  return { isSubscribed, setIsSubscribed };
}
