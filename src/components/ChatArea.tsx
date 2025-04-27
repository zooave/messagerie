import React, { useState } from "react";
import { Shield, Clock, Check, CheckCheck, Lock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import MessageComposer from "./MessageComposer";

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  sender: "me" | "them";
  status: "sent" | "delivered" | "read";
  expiresAt?: Date;
}

interface ChatAreaProps {
  recipientName?: string;
  recipientAvatar?: string;
  isOnline?: boolean;
  messages?: Message[];
  encryptionStatus?: "secure" | "pending" | "error";
}

const ChatArea = ({
  recipientName = "Alice Smith",
  recipientAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
  isOnline = true,
  messages = [
    {
      id: "1",
      content: "Hey there! How are you doing?",
      timestamp: new Date(Date.now() - 3600000),
      sender: "them",
      status: "read",
    },
    {
      id: "2",
      content:
        "I'm good, thanks! Just working on that encrypted messaging app we talked about.",
      timestamp: new Date(Date.now() - 3000000),
      sender: "me",
      status: "read",
    },
    {
      id: "3",
      content: "That sounds great! Is it end-to-end encrypted?",
      timestamp: new Date(Date.now() - 2400000),
      sender: "them",
      status: "read",
    },
    {
      id: "4",
      content: "Yes, absolutely! No one can read our messages except us.",
      timestamp: new Date(Date.now() - 1800000),
      sender: "me",
      status: "read",
    },
    {
      id: "5",
      content: "This message will expire in 1 hour.",
      timestamp: new Date(Date.now() - 900000),
      sender: "me",
      status: "delivered",
      expiresAt: new Date(Date.now() + 3600000),
    },
    {
      id: "6",
      content: "Perfect! Security is so important these days.",
      timestamp: new Date(Date.now() - 600000),
      sender: "them",
      status: "read",
    },
  ] as Message[],
  encryptionStatus = "secure",
}: ChatAreaProps) => {
  const [currentMessages, setCurrentMessages] = useState<Message[]>(messages);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getExpirationTimeLeft = (expiresAt: Date) => {
    const now = new Date();
    const diffMs = expiresAt.getTime() - now.getTime();
    if (diffMs <= 0) return "Expired";

    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}m left`;

    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ${diffMins % 60}m left`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <Check className="h-3 w-3 text-gray-400" />;
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case "read":
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const getEncryptionStatusIcon = () => {
    switch (encryptionStatus) {
      case "secure":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Lock className="h-4 w-4 text-green-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>End-to-end encrypted</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case "pending":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Lock className="h-4 w-4 text-yellow-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Encryption pending</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case "error":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Lock className="h-4 w-4 text-red-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Encryption error</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      default:
        return null;
    }
  };

  const handleSendMessage = (content: string, expirationTime?: number) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      timestamp: new Date(),
      sender: "me",
      status: "sent",
      ...(expirationTime && {
        expiresAt: new Date(Date.now() + expirationTime * 60000),
      }),
    };

    setCurrentMessages([...currentMessages, newMessage]);
  };

  return (
    <div className="flex flex-col h-full bg-background border-l">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={recipientAvatar} alt={recipientName} />
            <AvatarFallback>{recipientName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">{recipientName}</h2>
            <div className="flex items-center space-x-2">
              <span
                className={`h-2 w-2 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-400"}`}
              ></span>
              <span className="text-xs text-muted-foreground">
                {isOnline ? "Online" : "Offline"}
              </span>
              {getEncryptionStatusIcon()}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Shield className="h-3 w-3" />
            <span>Encrypted</span>
          </Badge>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col space-y-4">
          {currentMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
            >
              <Card
                className={`max-w-[70%] p-3 ${
                  message.sender === "me"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <div className="flex flex-col">
                  <p>{message.content}</p>
                  <div className="flex items-center justify-end space-x-1 mt-1">
                    {message.expiresAt && (
                      <div className="flex items-center text-xs opacity-70 space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{getExpirationTimeLeft(message.expiresAt)}</span>
                      </div>
                    )}
                    <span className="text-xs opacity-70">
                      {formatTime(message.timestamp)}
                    </span>
                    {message.sender === "me" && getStatusIcon(message.status)}
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </ScrollArea>

      <Separator />

      {/* Message Composer */}
      <MessageComposer
        onSendMessage={handleSendMessage}
        encryptionStatus={encryptionStatus}
      />
    </div>
  );
};

export default ChatArea;
