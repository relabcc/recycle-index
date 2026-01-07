import React, { useMemo, useRef } from "react";
import { useLocation } from "@reach/router";
import { useWindowSize } from "react-use";

import LastPage from "../containers/TrashPage/LastPage";
import useData from "../containers/TrashPage/data/useData";

const colorsCfg = {
  A: "#22bd73",
  B: "#ffa800",
  C: "#FF6695",
};

const parseQuery = (search) => {
  const sp = new URLSearchParams(search || "");
  return {
    name: sp.get("name") || undefined,
    id: sp.get("id") || undefined,
    debug: sp.get("debug") === "1",
  };
};

const selectTrash = (list, { name, id }) => {
  if (!list || !list.length) return null;
  if (name) {
    const hit = list.find((d) => d.name === name);
    if (hit) return hit;
  }
  if (id) {
    const hit = list.find((d) => String(d.id) === String(id));
    if (hit) return hit;
  }
  return list[0];
};

const LastDebugPage = () => {
  const location = useLocation();
  const query = useMemo(() => parseQuery(location.search), [location.search]);
  const windowSize = useWindowSize();
  const dataList = useData();
  const data = useMemo(() => selectTrash(dataList, query), [dataList, query]);

  const isMobile = windowSize.width <= 768;
  const trashWidth = useMemo(() => {
    if (!data) return 75;
    const base = isMobile ? 140 : 75;
    const scale = data.transform?.shareScale || data.transform?.scale || 100;
    return base * (scale / 100);
  }, [data, isMobile]);

  const faceId = data?.transform?.faceNo || 1;
  const colorScheme = colorsCfg[data?.recycleValue] || colorsCfg.B;
  const endTransition = useMemo(
    () => [
      [0 + (data?.transform?.mobileX || 0), -50 + (data?.transform?.mobileY || 0)],
      [0 + (data?.transform?.x || 0), -20 + (data?.transform?.y || 0)],
    ],
    [data?.transform?.mobileX, data?.transform?.mobileY, data?.transform?.x, data?.transform?.y]
  );
  const endPos = useMemo(
    () => [windowSize.width * 0.6 || 0, windowSize.height * 0.25 || 0],
    [windowSize.height, windowSize.width]
  );

  const pageUrl = typeof window !== "undefined" ? window.location.href : "";
  const endTrashRef = useRef();

  const moreTrashes = useMemo(() => {
    if (!dataList || !data) return [];
    return dataList
      .filter((d) => d.id !== data.id)
      .slice(0, 5)
      .map((d) => ({
        ...d,
        transform: d.transform || { homeScale: 100, homeX: 0, homeY: 0, scale: 100, faceNo: 1, face: "" },
      }));
  }, [data, dataList]);

  if (!data) {
    return <div style={{ padding: "1rem" }}>Loading trash data...</div>;
  }

  return (
    <LastPage
      windowSize={windowSize}
      trashWidth={trashWidth}
      data={data}
      isMobile={isMobile}
      colorScheme={colorScheme}
      pageUrl={pageUrl}
      endTrashRef={endTrashRef}
      endPos={endPos}
      endTransition={endTransition}
      faceId={faceId}
      moreTrashes={moreTrashes}
      debugGrid={query.debug}
    />
  );
};

export default LastDebugPage;
