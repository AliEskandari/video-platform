import { useState, useEffect } from "react";
import { getUserById } from "../services/firebase";

/**
 * User is initialized to 'undefined' until data is fetched
 * from backend.
 * @param {*} userId
 * @returns
 */
export default function useUser(userId) {
  const [activeUser, setActiveUser] = useState();

  useEffect(() => {
    async function getUserObjByUserId(userId) {
      const user = await getUserById(userId);
      setActiveUser(user || {});
    }

    if (userId) {
      getUserObjByUserId(userId);
    }
  }, [userId]);

  return { user: activeUser, setActiveUser };
}
