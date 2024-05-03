import Blueticks from "@/components/Blueticks";
import { useAuth } from "@/context/AuthContext";
import { ChatMessage } from "@/interfaces/interfaces";
import { ClockIcon } from "@heroicons/react/24/outline";
import { forwardRef } from "react";
import { useMessageContext } from "./Message";
import MessageReactions from "./MessageReactions";

type MessageBubbleProps = {
  message: ChatMessage;
  prev: ChatMessage | undefined;
  next: ChatMessage | undefined;
};
const MessageBubble = forwardRef<HTMLDivElement, MessageBubbleProps>(
  ({ message, prev, next }, messageRef) => {
    const { currentUserDetails } = useAuth();
    const isMine = message.senderID === currentUserDetails?.$id;
    const isSystem = message.senderID === "system";
    const prevSameSender = prev?.senderID === message.senderID;
    const nextSameSender = next?.senderID === message.senderID;
    const isOptimistic = !!message?.optimistic;
    const { showHoverCard } = useMessageContext();
    return (
      <div className="relative">
        <div
          ref={messageRef}
          className={`pointer-events-none relative  flex min-w-[3rem]  max-w-[80vw] select-none 
                flex-col gap-1 rounded-3xl p-3 py-2 ps-3 sm:max-w-[20rem]
                ${
                  isMine
                    ? `me-4 self-end bg-indigo-200  dark:bg-indigo-900 dark:text-white`
                    : "text-gray-100s bg-gray7   dark:bg-dark-gray6/90"
                } 

                ${
                  prevSameSender
                    ? isMine
                      ? "rounded-tr-md"
                      : "rounded-tl-md"
                    : ""
                }

                ${
                  nextSameSender
                    ? isMine
                      ? "rounded-br-md"
                      : "rounded-bl-md"
                    : ""
                }
                
                `}
        >
          <div className="flex flex-col justify-between gap-0.5 text-[0.9rem] leading-relaxed tracking-wide 2xs:flex-row">
            <pre className=" whitespace-pre-wrap font-sans">{message.body}</pre>
            <small className="ml-auto ms-2 inline-flex items-center gap-1 self-end text-[0.5rem] leading-none tracking-wider text-gray-500 dark:text-slate-300">
              {new Date(message.$createdAt)
                .toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                })
                .replace(" ", "")}
              {message.editedAt && (
                <>
                  <span className="text-lg font-semibold leading-3 tracking-tight">
                    .
                  </span>
                  <span>edited</span>
                </>
              )}

              {isMine ? (
                isOptimistic ? (
                  <ClockIcon className="relative h-3 w-3 text-gray-500" />
                ) : (
                  <Blueticks
                    read={message.read}
                    className="relative  dark:text-blue-400"
                  />
                )
              ) : null}
            </small>
          </div>
        </div>
        <div
          className={`absolute -bottom-3 z-10 ${
            isMine ? "-start-4" : "-end-4"
          }`}
        >
          <MessageReactions
            message={message}
            hoverCardShowing={showHoverCard}
          />
        </div>
      </div>
    );
  },
);

export default MessageBubble;
