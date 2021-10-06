import { useState, useEffect } from "react";
import { userCanWatchVideo as userCanWatchVideoHelper } from "../helpers/helpers";

export default function useUserCanWatchVideo(isSubscribed, video) {
  const [userCanWatchVideo, setUserCanWatchVideo] = useState();

  useEffect(() => {
    if (video) {
      setUserCanWatchVideo(userCanWatchVideoHelper(isSubscribed, video));
    }
  }, [isSubscribed, video]);

  return { userCanWatchVideo, setUserCanWatchVideo };
}
