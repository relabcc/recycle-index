import React from 'react'
import { Helmet } from 'react-helmet'

import Page from "../containers/DonatePage";
import useShowHeader from "../contexts/header/useShowHeader";
import Footer from "../containers/Footer";

const Donate = () => {
  useShowHeader("colors.yellow");

  return (
    <>
      <Helmet>
        <title>捐款支持</title>
      </Helmet>
      <Page />
      <Footer />
    </>
  );
};

export default Donate;
