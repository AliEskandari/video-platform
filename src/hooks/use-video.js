import { useState, useEffect } from "react";
import { getVideoById } from "../services/firebase";

export default function useVideo(videoId) {
  const [video, setVideo] = useState();

  useEffect(() => {
    async function getVideoObj(videoId) {
      const vid = await getVideoById(videoId);
      setVideo(vid || {});
    }
    if (videoId) {
      getVideoObj(videoId);
    }
  }, [videoId]);

  return { video, setVideo };
}
