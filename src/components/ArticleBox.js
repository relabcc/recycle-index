import React from 'react';
import Box from './Box';
import ReLink from './Link';

/**
 * 獨立的文章顯示組件
 * 自動從 Google Sheet 加載文章數據，無需依賴上層狀態
 */

const ArticleBox = ({ trashName, bg, color, article }) => {
  // 只有有 article 才渲染
  if (!article) {
    return null;
  }

  const { text, url } = article;
  const background = color;
  const textColor = 'white';

  return text ? (
    <Box mt={2} bg={background} p="1" ml="-1" mr="-1" color={textColor}>
      {url ? (
        <ReLink color="inherit" href={url} isExternal>
          {text}
        </ReLink>
      ) : (
        text
      )}
    </Box>
  ) : null;
};

export default ArticleBox;
