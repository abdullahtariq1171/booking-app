import React, { ReactNode } from 'react';
import { VStack } from '@chakra-ui/react';

interface IProps {
  children: ReactNode;
}

const PageWrapper = ({ children }: IProps) => {
  return (
    <VStack spacing={{ base: 10, md: 16 }} w='100%' mt={{ base: 4, md: 10 }} px={{ base: 4, md: 8 }} maxW='1440px' margin='0 auto'>
      {children}
    </VStack>
  );
};

export { PageWrapper };