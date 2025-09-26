import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Image,
  Text,
  Link,
  Box,
  useDisclosure,
} from '@chakra-ui/react';

const GlobalPopup = ({ config }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    if (!config || !config.enabled || hasShown) return;

    const timer = setTimeout(() => {
      onOpen();
      setHasShown(true);
    }, config.delay || 3000);

    return () => clearTimeout(timer);
  }, [config, hasShown, onOpen]);

  if (!config || !config.enabled) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={config.size || 'md'} isCentered>
      <ModalOverlay />
      <ModalContent>
        {config.title && (
          <ModalHeader>{config.title}</ModalHeader>
        )}
        <ModalCloseButton />
        <ModalBody>
          {config.image && (
            <Box mb={4}>
              <Image 
                src={config.image} 
                alt={config.imageAlt || config.title} 
                width="100%"
                borderRadius="md"
              />
            </Box>
          )}
          {config.content && (
            <Text dangerouslySetInnerHTML={{ __html: config.content }} />
          )}
        </ModalBody>
        <ModalFooter>
          {config.buttonText && config.buttonLink && (
            <Button
              as={Link}
              href={config.buttonLink}
              colorScheme="blue"
              mr={3}
              isExternal={config.buttonExternal}
            >
              {config.buttonText}
            </Button>
          )}
          <Button variant="ghost" onClick={onClose}>
            {config.closeText || '關閉'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GlobalPopup;