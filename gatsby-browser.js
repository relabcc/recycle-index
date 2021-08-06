/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it
import React from 'react'
import 'focus-visible'
import 'fullpage.js/vendors/scrolloverflow'

import './webp'
import wrapWithProvider from './with-provider';
import Layout from './src/containers/Layout'

export const wrapRootElement = wrapWithProvider;
export const wrapPageElement = ({ element, props }) => {
  // props provide same data to Layout as Page element will get
  // including location, data, etc - you don't need to pass it
  return <Layout {...props}>{element}</Layout>
}

export const onInitialClientRender = () => {
  const fonts = [
    'Concert One',
    'Nunito Sans:600,700,900',
    'Noto Sans TC:500,700,900',
  ].join('|')
  const params = new URLSearchParams()
  params.append('family', fonts)
  params.append('display', 'swap')
  const link = document.createElement('link')
  link.href = `https://fonts.googleapis.com/css?${params}`
  link.rel = 'stylesheet'
  document.head.append(link)
}
