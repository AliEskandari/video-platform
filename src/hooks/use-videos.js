import { useState, useEffect } from "react";
import { getVideosByUserId } from "../services/firebase";

export default function useVideos(user) {
  const [videos, setVideos] = useState([]);

  async function fetchVideos(user) {
    const results = await getVideosByUserId(user.id);
    // re-arrange array to be newest videos first by dateCreated
    results.sort((a, b) => b.dateCreated - a.dateCreated);
    setVideos(results);
  }

  useEffect(() => {
    if (user) {
      fetchVideos(user);
    }
  }, [user?.id]);

  return { videos, fetchVideos };
}
