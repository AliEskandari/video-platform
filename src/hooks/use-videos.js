import { useState, useEffect } from "react";
import { getVideosByUserId } from "../services/firebase";

export default function useVideos(user) {
  const [videos, setVideos] = useState([]);
  const [reload, setReload] = useState(null);

  useEffect(() => {
    async function fetchVideos() {
      const results = await getVideosByUserId(user.id);
      // re-arrange array to be newest videos first by dateCreated
      results.sort((a, b) => b.dateCreated - a.dateCreated);
      setVideos(results);
    }
    if (user) {
      fetchVideos();
      setReload(() => fetchVideos);
    }
  }, [user?.id]);

  return { videos, reload };
}
