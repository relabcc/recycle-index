import React from 'react'
import {
  Modal as ChModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
} from '@chakra-ui/react';

import { responsive } from './ThemeProvider/theme'

const Modal = ({
  header,
  body,
  footer,
  ...props
}) => {
  return (
    <ChModal {...props}>
      <ModalOverlay bg="rgba(255,255,255,0.5)" />
      <ModalContent
        border="3px solid"
        fontSize={responsive('2.5em', '1em')}
        rounded={responsive('1em', '1.5em')}
        maxWidth={responsive('90vw', '50em')}
      >
        <ModalHeader
          pt="2em"
          fontWeight="900"
          fontSize={responsive('1.5em', '1.25em')}
        >{header}</ModalHeader>
        <ModalCloseButton
          bg="black"
          color="white"
          width="2em"
          height="2em"
          rounded="full"
          fontSize="1em"
          right="0.5rem"
          _hover={{
            bg: 'black',
            color: 'white',
          }}
          _active={{
            bg: 'black',
            color: 'white',
          }}
        />
        <ModalBody>
          {body}
        </ModalBody>
        <ModalFooter>
          {footer}
        </ModalFooter>
      </ModalContent>
    </ChModal>
  )
}

export default Modal
