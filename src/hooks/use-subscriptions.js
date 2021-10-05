import { useState, useEffect } from "react";
import { getSubscriptions } from "../services/firebase";

export default function useSubscriptions(userId) {
  const [subscriptions, setSubscriptions] = useState();

  useEffect(() => {
    async function getSubscriptionsFunction(userId) {
      const subs = await getSubscriptions(userId);
      setSubscriptions(subs || []);
    }
    if (userId) {
      getSubscriptionsFunction(userId);
    }
  }, [userId]);

  return { subscriptions, setSubscriptions };
}
