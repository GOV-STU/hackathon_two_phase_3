"use client";

import { useState, useEffect } from "react";
import { ChatMessage } from "@/types/chat";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface ChatWindowProps {
  conversationId?: string | null;
  initialMessages?: ChatMessage[];
  onTaskUpdate?: () => void;
}

export function ChatWindow({
  conversationId: initialConversationId,
  initialMessages = [],
  onTaskUpdate
}: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [conversationId, setConversationId] = useState<string | null>(initialConversationId || null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    // Add user message optimistically
    const userMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await api.sendChatMessage(content, conversationId);

      // Update conversation ID if this is a new conversation
      if (!conversationId && response.conversation_id) {
        setConversationId(response.conversation_id);
      }

      // Replace temp user message with actual one and add assistant response
      setMessages((prev) => {
        const withoutTemp = prev.filter((msg) => msg.id !== userMessage.id);
        return [
          ...withoutTemp,
          {
            id: userMessage.id.replace("temp-", ""),
            role: "user" as const,
            content,
            createdAt: userMessage.createdAt,
          },
          {
            id: response.message_id,
            role: response.role as "user" | "assistant" | "system",
            content: response.content,
            createdAt: response.created_at,
            tool_calls: response.tool_calls,
          },
        ];
      });

      // Refresh tasks if tool calls were made
      if (response.tool_calls && response.tool_calls.length > 0 && onTaskUpdate) {
        onTaskUpdate();
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
      // Remove the optimistic user message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  // Show welcome message if no messages
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: "⚡ Neural interface online. I'm your AI task management system. I can create, update, delete, and organize your missions. What's your command?",
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  }, []);

  return (
    <div className="flex flex-col h-full bg-slate-900/30 backdrop-blur-sm relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 via-slate-900/50 to-slate-900/80 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent pointer-events-none" />

      {/* Messages Area */}
      <div className="relative flex-1 overflow-hidden">
        <MessageList messages={messages} isLoading={isLoading} />
      </div>

      {/* Input Area */}
      <div className="relative flex-shrink-0 border-t border-purple-500/20 bg-slate-900/80 backdrop-blur-xl">
        <MessageInput onSend={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}
