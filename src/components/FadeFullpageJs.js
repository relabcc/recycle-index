import React from 'react'
import ReactFullpage from '@fullpage/react-fullpage';

const pluginWrapper = () => {
  require('../vendor/fullpage.fadingEffect.min.js');
};

const FadeFullpageJs = (props) => {
  return (
    <ReactFullpage
      pluginWrapper={pluginWrapper}
      licenseKey="6313A8FC-72634A8F-B83D01C8-ACBFD3D5"
      fadingEffect
      controlArrows={false}
      {...props}
    />
  )
}

FadeFullpageJs.Wrapper = ReactFullpage.Wrapper

export default FadeFullpageJs
