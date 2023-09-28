import { useAppSelector } from "../../context/AppContext";
import Chats from "../Chats/Chats";
import Users from "../UsersList/Users";
import * as Tabs from "@radix-ui/react-tabs";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useColorMode,
  Button,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
} from "@chakra-ui/react";

import { ChatIcon, GroupIcon, PlusIcon } from "../../components/Icons";
import Profile from "../Profile/Profile";
import { useAuth } from "../../context/AuthContext";
import Settings from "../Settings/Settings";
import { addUserToGlobalChat } from "../../services/registerUserService";
import { useMemo } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import NewGroupForm from "../Groups/NewGroup/NewGroupForm";
import { useState } from "react";
import { UserGroupIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Box } from "@chakra-ui/react";
import { blueDark, gray } from "@radix-ui/colors";
const Sidebar = () => {
  const { activePage, setActivePage } = useAppSelector();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();
  const { currentUserDetails } = useAuth();
  if (!currentUserDetails) return;

  return (
    <Box
      as={"aside"}
      gap={0}
      px={0}
      className="bg-gray2 dark:bg-dark-blue2/[0.998] dark:text-gray2  grid grid-rows-[80px_1fr] shrink basis-96 px-2 grow  md:max-w-[25rem]"
    >
      <div className="w-full font-semibold tracking-widest">
        <span className="relative flex items-center justify-center w-full h-full ">
          {activePage}
          <button
            onClick={onOpen}
            aria-label="Create new group"
            className="absolute flex p-2 text-sm font-normal rounded dark:text-gray8 right-3"
            title="New group"
          >
            <UserGroupIcon className="w-5 h-5" />
            <PlusIcon className="relative w-4 h-4 dark:text-white right-1" />
          </button>
        </span>

        <Modal
          isOpen={isOpen}
          onClose={onClose}
          isCentered
          scrollBehavior="outside"
        >
          <ModalOverlay />
          <ModalContent
            bg={colorMode === "dark" ? blueDark.blue1 : gray.gray2}
            height={"90vh"}
            overflowY={"auto"}
          >
            <ModalHeader className="flex flex-col w-full gap-1 text-xl font-bold dark:text-white text-dark-gray3">
              New Group
              <div className="font-md text-[14px] tracking-wide dark:text-gray6 text-dark-gray6 ">
                Create a new group chat.
              </div>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <NewGroupForm onClose={onClose} />
            </ModalBody>
          </ModalContent>
        </Modal>
      </div>
      <section className="flex flex-col overflow-x-hidden overflow-y-auto">
        <Tabs.Content value="Chats" className="">
          <Chats />
        </Tabs.Content>
        <Tabs.Content
          value="Users"
          forceMount={activePage === "Users" ? true : undefined}
        >
          <Users />
        </Tabs.Content>

        <Tabs.Content value="Profile">
          <Profile user={currentUserDetails} />
        </Tabs.Content>
        <Tabs.Content value="Settings">
          <Settings />
        </Tabs.Content>
        <Tabs.Content value="New Group">
          Coming soon! Add Group feature
        </Tabs.Content>
      </section>
    </Box>
  );
};

export default Sidebar;
