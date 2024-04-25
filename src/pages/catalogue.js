import React from "react";
import { Helmet } from "react-helmet";

import Page from "../containers/CataloguePage";

const Render = () => {
  return (
    <>
      <Helmet titleTemplate={null}>
        <title>回收大百科｜台灣最具參考性的垃圾回收指南</title>
        <meta
          name="description"
          content="寶特瓶回收瓶蓋要分開嗎？PLA是什麼？資源回收這麼難，回收大百科收錄台灣人必懂的 101+ 常見垃圾，提供正確回收知識、認識垃圾回收價值，讓你懂分、懂丟、懂垃圾。"
        />
      </Helmet>
      <Page />
    </>
  );
};

export default Render;
