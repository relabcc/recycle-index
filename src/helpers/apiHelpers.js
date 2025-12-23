// Build API endpoint with range parameter; add mock flag on localhost
export const getApiEndpoint = (range) => {
  const params = new URLSearchParams();
  if (range) params.set("range", range);

  const isLocal = typeof window !== "undefined" && window.location.hostname === "localhost";
  if (isLocal) params.set("mock", "1");

  const base = isLocal
    ? "https://recycle-index.pages.dev/api/data"
    : "/api/data";

  return `${base}?${params.toString()}`;
};
