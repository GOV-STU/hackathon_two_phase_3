"use client";

import { useEffect, useRef } from "react";
import { ChatMessage } from "@/types/chat";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { AnimatePresence } from "framer-motion";

interface MessageListProps {
  messages: ChatMessage[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-auto px-4 py-6 space-y-4 scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent hover:scrollbar-thumb-purple-500/50"
    >
      <AnimatePresence mode="popLayout">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            role={message.role}
            content={message.content}
            timestamp={message.createdAt}
            toolCalls={message.tool_calls}
          />
        ))}
      </AnimatePresence>

      {isLoading && <TypingIndicator />}

      <div ref={messagesEndRef} />
    </div>
  );
}
