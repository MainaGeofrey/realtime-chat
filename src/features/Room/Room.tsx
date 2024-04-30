import { useState } from "react";
//@ts-ignore
import NoSelectedChat from "@/components/NoSelectedChat";
import { useAuth } from "@/context/AuthContext";
import { useChatsContext } from "@/context/ChatsContext";
import { RoomActionTypes, useRoomContext } from "@/context/Room/RoomContext";
import useRoomSubscription from "@/features/Room/hooks/useRoomSubscription";
import { Box } from "@chakra-ui/react";
import useCommand from "../../utils/hooks/useCommand";
import ChatHeader from "./ChatHeader";
import MessageInput from "./Messages/MessageInput/MessageInput";
import Messages from "./Messages/MessagesList";
import RoomDetails from "./RoomDetails/RoomDetails";
import { RoomDetailsFooter } from "./RoomDetails/RoomDetailsFooter";

function Room() {
  const { currentUserDetails } = useAuth();
  const { selectedChat } = useChatsContext();
  const { dispatch } = useRoomContext();
  const [showDetails] = useState(false);
  useCommand("Escape", () => {
    dispatch({
      type: RoomActionTypes.EXIT_SELECTING_MESSAGES,
      payload: null,
    });
  });

  //subscribe to realtime changes in the room
  useRoomSubscription();
  if (!currentUserDetails) return null;

  if (!selectedChat) return <NoSelectedChat />;
  return (
    <>
      <Box
        className={`grid h-full grow grid-rows-[1fr_6fr_0.2fr] bg-gray2 dark:bg-dark-blue1`}
      >
        <ChatHeader key={`header-${selectedChat.$id}`} />
        <Messages key={`messagesList-${selectedChat.$id}`}></Messages>
        <MessageInput key={`input-${selectedChat.$id}`} />
      </Box>
      <aside
        className={`hidden ${
          showDetails && "absolute inset-0"
        } flex  grow basis-40 flex-col items-center border-l pb-4 pt-6  transition-all dark:border-dark-slate4 md:static md:max-w-[20rem] xl:flex`}
      >
        <RoomDetails />
        <RoomDetailsFooter />
      </aside>
    </>
  );
}

export default Room;

export const Component = Room;
