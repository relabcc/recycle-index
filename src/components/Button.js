import React from 'react';
import { Button, IconButton } from "@chakra-ui/react";

import Link from './Link'

const ReButton = ({ href, to, ...props }) => {
  if (href || to) return <Button as={p => <Link {...p} href={href} to={to} />} {...props} />
  return <Button {...props} />
}

ReButton.defaultProps = {
  colorScheme: 'yellow',
  rounded: '0.5em',
  letterSpacing: '0.125em',
  height: '2em',
  border: '0.125em solid black',
  px: '1em',
}

ReButton.Secondary = props => (
  <ReButton colorScheme="pink" {...props} />
)

ReButton.Pink = props => (
  <ReButton
    colorScheme="pink"
    bg="colors.pink"
    color="black"
    _hover={{
      bg: 'pink.400',
    }}
    {...props}
  />
)

ReButton.Yellow = props => (
  <ReButton
    colorScheme="yellow"
    bg="colors.yellow"
    color="black"
    _hover={{
      bg: 'yellow.400',
    }}
    {...props}
  />
)

ReButton.Orange = props => (
  <ReButton
    colorScheme="orange"
    bg="colors.orange"
    color="black"
    _hover={{
      bg: 'orange.400',
    }}
    _active={{
      bg: 'orange.400',
    }}
    {...props}
  />
)

ReButton.Danger = props => (
  <ReButton colorScheme="red" {...props} />
)

ReButton.Icon = ({ href, to, ...props }) => {
  if (href || to) return <IconButton as={p => <Link {...p} href={href} to={to} />} {...props} />
  return <IconButton {...props} />
}

export default ReButton
