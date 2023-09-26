import React, { useEffect, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
//@ts-ignore
import avatarFallback from "../../assets/avatarFallback.png";
import { IUserDetails, IChat, IGroup } from "../../interfaces";
import { getFormatedDate } from "../../services/dateServices";
import { getUserDetails, deleteContact } from "../../services/userServices";
import { useAuth } from "../../context/AuthContext";
import { useChatsContext } from "../../context/ChatsContext";
import useSWR, { mutate } from "swr";
import { clearChatMessages } from "../../services/chatMessageServices";
import { toast } from "react-hot-toast";
import Avatar from "../../components/Avatar";

interface IChatProps {
  conversation: IChat | IGroup;
}

const Chat = ({ conversation }: IChatProps) => {
  const { currentUserDetails, currentUser } = useAuth();
  if (!currentUserDetails) return null;
  const { setSelectedChat, selectedChat, setRecepient } = useChatsContext();
  const [showHoverCard, setShowHoverCard] = useState(false);

  const isGroup = !!conversation?.groupMessages;
  const isPersonal =
    !isGroup &&
    conversation.participants?.every(
      (participant: IUserDetails) => participant.$id === currentUserDetails.$id,
    );

  //only fetch data only if conversation is not a group chat or a personal chat

  let { data: contactDetails } = useSWR<IUserDetails>(
    () => {
      if (isGroup) return false;
      else if (isPersonal) return false;
      else {
        return (conversation as IChat).participants.filter(
          (participant) => participant.$id !== currentUserDetails?.$id,
        )[0]?.$id;
      }
    },
    getUserDetails,
    { keepPreviousData: true, revalidateIfStale: false },
  );

  if (isPersonal) {
    contactDetails = currentUserDetails;
  }

  const isActive = selectedChat?.$id === conversation.$id;

  return (
    <div
      onMouseOver={() => setShowHoverCard(true)}
      onMouseLeave={() => setShowHoverCard(false)}
      onClick={() => {
        setRecepient(contactDetails);
        setSelectedChat(conversation);
      }}
      className={`transition-all flex items-start px-2 py-3 rounded-md cursor-pointer hover:bg-slate-100 dark:hover:bg-dark-slate6 ${
        isActive ? "bg-slate-200 dark:bg-dark-slate3" : ""
      }`}
    >
      <Avatar
        name={
          isGroup
            ? conversation.name
            : isPersonal
            ? "You"
            : contactDetails?.name || " "
        }
      />

      <div className="flex flex-col ml-2 overflow-hidden shrink text-ellipsis">
        <span className="text-lg font-semibold tracking-wider whitespace-nowrap overflow-hidden text-ellipsis max-w-[9rem] dark:text-gray1">
          {isGroup
            ? conversation.name
            : isPersonal
            ? "You"
            : contactDetails?.name}
        </span>
        <span className="overflow-hidden font-sans text-sm font-normal whitespace-nowrap text-ellipsis dark:text-gray6">
          {isGroup
            ? conversation.description
            : contactDetails?.about || "Hi there! I am using VChat"}
        </span>
      </div>
      <div className="flex flex-col gap-4 mx-3 mt-1 ml-auto mr-3 text-gray8 ">
        <span className="relative flex text-xs tracking-tight ">
          {getFormatedDate(conversation.$updatedAt)}
        </span>
        {!isGroup && showHoverCard && (
          <DropdownMenu.Root modal={false}>
            <DropdownMenu.Trigger>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setShowHoverCard(true);
                }}
                onMouseLeave={(e) => {
                  e.stopPropagation();
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.4}
                  stroke="currentColor"
                  className="w-5 h-5 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </div>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="z-30 flex flex-col overflow-hidden bg-gray-500 rounded">
                <DropdownMenu.Item className="px-3 py-2 hover:bg-gray-600 hover:text-gray-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      let promise = clearChatMessages(conversation.$id);
                      toast.promise(promise, {
                        loading: "Clearing chat messages...",
                        success: "Cleared",
                        error:
                          "Whoops! Cannot clear this chat's messages at the moment. Try again later",
                      });
                      promise.then(() => {
                        mutate(selectedChat?.$id);
                      });
                    }}
                    className="w-full"
                  >
                    Clear messages
                  </button>
                </DropdownMenu.Item>
                <DropdownMenu.Item className="px-3 py-2 hover:bg-gray-600 hover:text-gray-200">
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();

                      if (contactDetails) {
                        let promise = deleteContact(conversation.$id);
                        // promise.then(() => mutate(currentUserDetails.$id));

                        toast.promise(promise, {
                          loading: "deleting contact...",
                          success: "deleted",
                          error: "cannot delete contact",
                        });
                      }
                    }}
                    className="w-full"
                  >
                    Delete contact
                  </button>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        )}
      </div>
    </div>
  );
};

export default Chat;
