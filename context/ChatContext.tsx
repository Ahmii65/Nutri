import React, { createContext, ReactNode, useContext, useState } from "react";
import { ChatContextType, ChatMessage } from "../types";

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = (text: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: "user",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [newMessage, ...prev]);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(text),
        sender: "ai",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [aiResponse, ...prev]);
      setIsTyping(false);
    }, 2000);
  };

  const getAIResponse = (input: string): string => {
    const lower = input.toLowerCase();
    if (lower.includes("hello") || lower.includes("hi")) {
      return "Hello! I'm here to help you achieve your nutrition goals. What's on your mind?";
    }
    if (lower.includes("diet") || lower.includes("plan")) {
      return "I can create a personalized diet plan for you. Could you tell me about your dietary preferences?";
    }
    if (lower.includes("protein")) {
      return "Protein is essential for muscle repair! Good sources include chicken, fish, tofu, and legumes.";
    }
    if (lower.includes("weight")) {
      return "Weight management is largely about calorie balance. Are you looking to lose, gain, or maintain weight?";
    }
    return "That's an interesting topic! Nutrition is complex, but I'm here to simplify it for you. Could you be more specific?";
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, isTyping }}>
      {children}
    </ChatContext.Provider>
  );
};
