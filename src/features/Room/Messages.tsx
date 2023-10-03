import { AnimatePresence } from "framer-motion";
import { IChatMessage, IGroupMessage } from "../../interfaces";
import Message from "./Message";

interface MessagesProps {
  messages: IGroupMessage[] | IChatMessage[];
  onDelete: (message: IChatMessage | IGroupMessage) => Promise<void>;
}

function Messages({ messages, onDelete }: MessagesProps) {
  return (
    <div className="relative self-stretch overflow-y-auto grow">
      <div className="flex flex-col-reverse h-full p-2 pb-4 overflow-y-scroll transition-all">
        {messages.length > 0 ? (
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <Message
                message={message}
                onDelete={onDelete}
                key={message.$id}
              />
            ))}
          </AnimatePresence>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full gap-2 dark:text-gray2">
            <div className="text-lg font-bold tracking-wider">No Messages</div>
            <div className="">
              Start the conversation by typing your message below
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;
