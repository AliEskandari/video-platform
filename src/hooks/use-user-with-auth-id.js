import { useState, useEffect } from "react";
import { getUserByUserAuthId } from "../services/firebase";

export default function useUserWithAuthId(userAuthId) {
  const [activeUser, setActiveUser] = useState();

  useEffect(() => {
    async function getUserObjByUserAuthId(userAuthId) {
      const [user] = await getUserByUserAuthId(userAuthId);
      setActiveUser(user || {});
    }

    if (userAuthId) {
      getUserObjByUserAuthId(userAuthId);
    }
  }, [userAuthId]);

  return { user: activeUser, setActiveUser };
}
