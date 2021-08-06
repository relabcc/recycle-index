/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it
import React from 'react'
import wrapWithProvider from './with-provider';
import Layout from './src/containers/Layout'

export const wrapRootElement = wrapWithProvider;
export const wrapPageElement = ({ element, props }) => {
  // props provide same data to Layout as Page element will get
  // including location, data, etc - you don't need to pass it
  return <Layout {...props}>{element}</Layout>
}

export const onRenderBody = ({ setHeadComponents, setPostBodyComponents  }) => {
  const HeadComponents = [
    <link key="fonts.dns" rel="dns-prefetch" href="//fonts.googleapis.com" />,
    // <link key="fonts.googleapis" rel="preconnect" href="https://fonts.googleapis.com" />,
    // <link key="fonts.gstatic" rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />,
  ]

  setHeadComponents(HeadComponents)

  const BodyComponents = [
    <script key="bodymovin.cdn" src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.7.12/lottie_light.min.js" integrity="sha512-z/Usjm8khSdtJkJlvYdEBJX5Q+MJjKIKkopb62CylWWKRID4yVorCCkAAqpYGX+j/Y1CwLUwTD/7beRZCfURIQ==" crossOrigin="anonymous" referrerPolicy="no-referrer" />,
  ]
  setPostBodyComponents(BodyComponents)
}
