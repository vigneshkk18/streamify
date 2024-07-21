import { useSearch } from "wouter";
import { useEffect, useState } from "react";

export default function useSearchParams<T extends Record<string, string>>() {
  const search = useSearch();
  const [params, setParams] = useState<T>();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const paramsObj = [...params.entries()].reduce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (acc, entry: [keyof T, any]) => {
        acc[entry[0]] = entry[1];
        return acc;
      },
      {} as T
    );
    setParams(paramsObj);
  }, [search]);

  return params;
}
