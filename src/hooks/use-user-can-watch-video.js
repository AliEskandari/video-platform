import { useState, useEffect } from "react";
import { userCanWatchVideo as userCanWatchVideoHelper } from "../helpers/helpers";

export default function useUserCanWatchVideo(authUser, isSubscribed, video) {
  const [userCanWatchVideo, setUserCanWatchVideo] = useState();

  useEffect(() => {
    if (video) {
      setUserCanWatchVideo(
        userCanWatchVideoHelper(authUser, isSubscribed, video)
      );
    }
  }, [authUser, isSubscribed, video]);

  return { userCanWatchVideo, setUserCanWatchVideo };
}
