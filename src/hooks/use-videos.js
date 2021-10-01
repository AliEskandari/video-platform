import { useState, useEffect } from "react";
import { getVideosByUserId } from "../services/firebase";

export default function useVideos(user) {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    async function getUserVideos() {
      if (user) {
        const results = await getVideosByUserId(user.docId);
        // re-arrange array to be newest videos first by dateCreated
        results.sort((a, b) => b.dateCreated - a.dateCreated);
        setVideos(results);
      }
    }

    getUserVideos();
  }, [user?.docId]);

  return { videos };
}
