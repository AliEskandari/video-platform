import { useState, useEffect } from "react";
import { getVideosByUserId, getAllVideos } from "../services/firebase";

/**
 * Initializes videos to an empty array until data is fetched
 * from backend.
 * @param {*} options filter videos by user or all; must choose one
 * @returns
 */
export default function useVideos({ user, all } = {}) {
  const [videos, setVideos] = useState([]);
  const [reload, setReload] = useState(null);

  useEffect(() => {
    async function fetchUserVideos() {
      const results = await getVideosByUserId(user.id);
      // sort array newest first
      results.sort((a, b) => b.dateCreated - a.dateCreated);
      setVideos(results);
    }

    async function fetchAllVideos() {
      const results = await getAllVideos();
      // sort array newest first
      results.sort((a, b) => b.dateCreated - a.dateCreated);
      setVideos(results);
    }

    if (user) {
      fetchUserVideos();
      setReload(() => fetchUserVideos);
    } else if (all) {
      fetchAllVideos();
    }
  }, [user?.id]);

  return { videos, reload };
}
