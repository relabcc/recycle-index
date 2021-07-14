import React from 'react';
import { Global, css } from '@emotion/react'

const Provider = ({ children }) => {
  return (
    <>
      {children}
      <Global styles={css`
      html, body { font-size: 16px; }
      @media (min-width: 768px) {
        html, body { font-size: 10px; }
      }
      @media (min-width: 922px) {
        html, body { font-size: 12px; }
      }
      @media (min-width: 1080px) {
        html, body { font-size: 14px; }
      }
      @media (min-width: 1240px) {
        html, body { font-size: 16px; }
      }
      @media (min-width: 1400px) {
        html, body { font-size: 18px; }
      }
      @media (min-width: 1560px) {
        html, body { font-size: 20px; }
      }
      @media (min-width: 1720px) {
        html, body { font-size: 22px; }
      }
      @media (min-width: 1880px) {
        html, body { font-size: 24px; }
      }
      `} />
    </>
  )
}

export default Provider;
