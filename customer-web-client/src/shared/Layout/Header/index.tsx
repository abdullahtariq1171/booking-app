import React from "react";
import {
  HStack,
  Text,
  Flex,
  useColorModeValue,
  useColorMode,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon, HamburgerIcon } from "@chakra-ui/icons";

import { Button, IconButton } from "shared/Button";

const Header = () => {
  const { toggleColorMode: toggleMode } = useColorMode();
  const textColor = useColorModeValue("gray.700", "primary.300");
  const SwitchIcon = useColorModeValue(MoonIcon, SunIcon);
  const bg = useColorModeValue("white", "gray.900");
  const themeText = useColorModeValue("dark", "light");
  const borderColor = useColorModeValue("gray.100", "gray.800");

  return (
    <HStack
      position="fixed"
      height={{ base: "50px", lg: "70px" }}
      px={3}
      top={0}
      left={0}
      right={0}
      justify="space-between"
      zIndex={5}
      background={bg}
      borderTop="5px solid"
      borderTopColor="primary.400"
      w="full"
      overflowY="hidden"
      borderBottom="2px solid"
      borderBottomColor={borderColor}
    >
      <Text
        fontWeight="700"
        color={textColor}
        fontSize={{ base: "md", lg: "xl" }}
      >
        Booking App
      </Text>
      <Flex justify="flex-end" align="center" color="gray.400">
        <HStack spacing="5" display={{ base: "none", md: "flex" }}>
          <Button colorScheme="brand" variant="ghost" size="sm">
            Sign in
          </Button>
          <Button colorScheme="primary" variant="solid" size="sm">
            Sign up
          </Button>
        </HStack>
        <HStack spacing={1}>
          <IconButton
            size="md"
            fontSize="lg"
            title={`Switch to ${themeText} mode`}
            variant="ghost"
            color="current"
            ml={{ base: "0", md: "3" }}
            onClick={toggleMode}
            icon={<SwitchIcon />}
            withoutTooltip
          />
          <IconButton
            display={{ base: "flex", md: "none" }}
            title="Open menu"
            fontSize="20px"
            color={useColorModeValue("gray.800", "inherit")}
            variant="ghost"
            withoutTooltip
            icon={<HamburgerIcon />}
            // onClick={mobileNav.onOpen}
          />
        </HStack>
      </Flex>
    </HStack>
  );
};

export { Header };