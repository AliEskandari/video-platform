import { useState, useEffect } from "react";
import { getVideosByUserId, getNonExclusiveVideos } from "../services/firebase";

/**
 * Initializes videos to undefined until data is fetched
 * from backend.
 * @param {*} options filter videos by user or all; must choose one
 * @returns
 */
export default function useVideos({ user, all } = {}) {
  const [videos, setVideos] = useState();
  const [reload, setReload] = useState(null);

  useEffect(() => {
    async function fetchUserVideos() {
      const results = await getVideosByUserId(user.id);
      // sort array newest first
      results.sort((a, b) => b.dateCreated - a.dateCreated);
      setVideos(results);
    }

    async function fetchNonExclusiveVideos() {
      const results = await getNonExclusiveVideos();
      // sort array newest first
      results.sort((a, b) => b.dateCreated - a.dateCreated);
      setVideos(results);
    }

    if (user) {
      fetchUserVideos();
      setReload(() => fetchUserVideos);
    } else if (all) {
      fetchNonExclusiveVideos();
    }
  }, [user?.id]);

  return { videos, reload };
}
