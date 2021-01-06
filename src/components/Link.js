import React from 'react'
import { Link } from "@chakra-ui/react";
import { Link as RouterLink } from 'gatsby'

const ReLink = ({ to, ...props }) => (
  <Link
    as={to ? RouterLink : 'a'}
    to={to}
    target={to ? '_self' : '_blank'}
    {...props}
  />
)

ReLink.MdLink = props => <Link fontWeight="700" color="yellow.500" {...props} />

export default ReLink
