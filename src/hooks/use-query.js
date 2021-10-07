import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import qs from "qs";

export default function useQuery() {
  const location = useLocation();
  const [query, setQuery] = useState();

  useEffect(() => {
    let parsed = qs.parse(location.search, { ignoreQueryPrefix: true }).q;
    setQuery(parsed);
  }, [location]);

  return { query };
}
