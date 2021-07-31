import React from 'react'
import { Link } from "@chakra-ui/react";
import { Link as RouterLink } from 'gatsby'

const ReLink = ({ to, ...props }) => (
  <Link
    as={to ? p => <RouterLink {...p} to={to} /> : 'a'}
    {...props}
  />
)

ReLink.MdLink = ({ node, ...props }) => <Link fontWeight="700" color="yellow.500" isExternal {...props} />

export default ReLink
