"use client";

import { cn } from "@/lib/utils";
import { User, CheckCircle2, XCircle, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  toolCalls?: Array<{ tool_name: string; status: string }>;
}

export function MessageBubble({ role, content, timestamp, toolCalls }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "flex gap-3 group",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg relative",
          isUser
            ? "bg-gradient-to-br from-cyan-600 to-blue-600 shadow-cyan-500/30"
            : "bg-gradient-to-br from-purple-600 to-pink-600 shadow-purple-500/30"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-white" />
        ) : (
          <>
            <Zap className="h-4 w-4 text-white animate-pulse" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity" />
          </>
        )}
      </div>

      {/* Message Content */}
      <div className={cn("flex flex-col gap-1 max-w-[85%] sm:max-w-[75%]", isUser && "items-end")}>
        {/* Message Bubble */}
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 shadow-lg backdrop-blur-sm border transition-all",
            isUser
              ? "bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-tr-sm border-cyan-400/30 shadow-cyan-500/20"
              : "bg-slate-800/80 text-cyan-100 rounded-tl-sm border-purple-500/20 shadow-purple-500/10"
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {content}
          </p>
        </div>

        {/* Tool Calls Indicator */}
        {toolCalls && toolCalls.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {toolCalls.map((tool, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border backdrop-blur-sm",
                  tool.status === "success"
                    ? "bg-green-600/20 border-green-400/30 text-green-300 shadow-sm shadow-green-500/20"
                    : "bg-red-600/20 border-red-400/30 text-red-300 shadow-sm shadow-red-500/20"
                )}
              >
                {tool.status === "success" ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <XCircle className="h-3 w-3" />
                )}
                <span className="capitalize">
                  {tool.tool_name.replace(/_/g, " ")}
                </span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Timestamp */}
        {timestamp && (
          <span className="text-xs text-purple-300/40 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {new Date(timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>
    </motion.div>
  );
}
