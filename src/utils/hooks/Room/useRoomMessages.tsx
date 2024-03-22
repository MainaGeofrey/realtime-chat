import useSWR, { useSWRConfig } from "swr";
import { sortDocumentsByCreationDateDesc } from "../..";
import { useChatsContext } from "../../../context/ChatsContext";
import { useRoomContext } from "../../../context/Room/RoomContext";
import { DirectMessageDetails, GroupMessageDetails } from "../../../interfaces";
import { getChatMessages } from "../../../services/chatMessageServices";
import { getGroupMessages } from "../../../services/groupMessageServices";

export default function useRoomMessages() {
  const { selectedChat } = useChatsContext();
  const { isGroup, roomMessagesKey } = useRoomContext();
  const { cache } = useSWRConfig();
  const isFirstRender = cache.get(roomMessagesKey!) === undefined;

  async function getRoomMessages() {
    if (!selectedChat) return undefined;
    if (isFirstRender) {
      return getFallbackMessages();
    }
    if (isGroup) {
      const messages = await getGroupMessages(selectedChat.$id);
      return messages;
    }
    const messages = await getChatMessages(selectedChat.$id);
    return messages.sort(sortDocumentsByCreationDateDesc);
  }

  function getFallbackMessages() {
    if (!selectedChat) return undefined;
    if (isGroup) {
      return selectedChat.groupMessages.sort(
        sortDocumentsByCreationDateDesc,
      ) as GroupMessageDetails[];
    } else {
      return selectedChat.chatMessages.sort(
        sortDocumentsByCreationDateDesc,
      ) as DirectMessageDetails[];
    }
  }
  return useSWR(
    () => (selectedChat ? `${selectedChat.$id}-messages` : null),
    getRoomMessages,
    { fallbackData: getFallbackMessages() },
  );
}
