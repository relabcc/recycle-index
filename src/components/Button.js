import React, { forwardRef } from 'react';
import { Button, IconButton } from "@chakra-ui/react";

import Link from './Link'

const ReButton = forwardRef(({ href, to, ...props }, ref) => {
  if (href || to) return <Button ref={ref} as={p => <Link {...p} href={href} to={to} ref={ref} />} {...props} />
  return <Button ref={ref} {...props} />
})

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

ReButton.Pink = forwardRef((props, ref) => (
  <ReButton
    colorScheme="pink"
    bg="colors.pink"
    color="black"
    _hover={{
      bg: 'pink.400',
    }}
    ref={ref}
    {...props}
  />
))

ReButton.Yellow = forwardRef((props, ref) => (
  <ReButton
    colorScheme="yellow"
    bg="colors.yellow"
    color="black"
    _hover={{
      bg: 'yellow.400',
    }}
    ref={ref}
    {...props}
  />
))

ReButton.Orange = forwardRef((props, ref) => (
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
    ref={ref}
    {...props}
  />
))

ReButton.Danger = props => (
  <ReButton colorScheme="red" {...props} />
)

ReButton.Icon = forwardRef(({ href, to, ...props }, ref) => {
  if (href || to) return <IconButton ref={ref} as={p => <Link {...p} href={href} to={to} ref={ref} />} {...props} />
  return <IconButton ref={ref} {...props} />
})

export default ReButton
