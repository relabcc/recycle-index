import React, { createElement, useMemo } from "react";
import { Helmet } from "react-helmet";
import useTrashData from "./useTrashData";

const withData = (SubComp) => (props) => {
  const {
    pageContext: { id, name, rawData, gatsbyImg, readMore, article, oceanTrash },
  } = props;
  const srcData = useMemo(() => JSON.parse(rawData), [rawData]);
  const gatsbyImages = useMemo(() => JSON.parse(gatsbyImg), [gatsbyImg]);
  const moreTrashes = useMemo(() => JSON.parse(readMore), [readMore]);
  const articleData = useMemo(() => JSON.parse(article || 'null'), [article]);
  const oceanTrashData = useMemo(() => JSON.parse(oceanTrash || 'null'), [oceanTrash]);

  const articles = useMemo(() => {
    if (articleData) {
      return [articleData];
    }
    return [];
  }, [articleData]);

  const oceanTrashList = useMemo(() => {
    if (oceanTrashData) {
      return [oceanTrashData];
    }
    return [];
  }, [oceanTrashData]);

  const data = useTrashData(srcData, gatsbyImages, articles, oceanTrashList);
  return (
    <>
      <Helmet>
        <title>
          {srcData.seoTitle || `${name}回收：${name}回收要怎麼做？`}
        </title>
        <meta
          name="og:image"
          content={`${props.data?.site.siteMetadata.siteUrl}/share/${id}.jpg`}
        />
        <meta
          name="description"
          content={
            srcData.seoDescription ||
            `${name}回收該怎麼做好呢？回收大百科教你如何處理${name}的回收跟垃圾分類。讓我們一起幫每個垃圾找到回家的路！`
          }
        />
      </Helmet>
      {createElement(SubComp, {
        key: id,
        ...props,
        trashData: data,
        moreTrashes,
      })}
    </>
  );
};

export default withData;
