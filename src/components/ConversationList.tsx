import React, { useState } from "react";
import { Search, Plus, Check, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Conversation {
  id: string;
  contactName: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  isOnline: boolean;
  isEncrypted: boolean;
}

interface ConversationListProps {
  conversations?: Conversation[];
  onSelectConversation?: (id: string) => void;
  onNewConversation?: () => void;
  selectedConversationId?: string;
}

const ConversationList = ({
  conversations = defaultConversations,
  onSelectConversation = () => {},
  onNewConversation = () => {},
  selectedConversationId = "",
}: ConversationListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter((conversation) =>
    conversation.contactName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full border-r bg-background">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold mb-4">Messages</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          onClick={onNewConversation}
          className="w-full mt-4"
          variant="outline"
        >
          <Plus className="mr-2 h-4 w-4" /> New Conversation
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`flex items-start p-3 rounded-md cursor-pointer mb-1 ${
                  selectedConversationId === conversation.id
                    ? "bg-accent"
                    : "hover:bg-muted"
                }`}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={conversation.avatar} />
                    <AvatarFallback>
                      {conversation.contactName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></span>
                  )}
                </div>
                <div className="ml-3 flex-1 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium truncate">
                      {conversation.contactName}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {conversation.timestamp}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.isEncrypted && (
                        <span className="mr-1">🔒</span>
                      )}
                      {conversation.lastMessage}
                    </p>
                    {conversation.unread > 0 && (
                      <Badge
                        variant="default"
                        className="ml-2 h-5 min-w-5 px-1.5 rounded-full"
                      >
                        {conversation.unread}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center mt-1">
                    {selectedConversationId === conversation.id ? (
                      <span className="text-xs text-primary flex items-center">
                        <Check className="h-3 w-3 mr-1" /> Read
                      </span>
                    ) : conversation.unread > 0 ? (
                      <span className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" /> Delivered
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground flex items-center">
                        <Check className="h-3 w-3 mr-1" /> Seen
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No conversations found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

const defaultConversations: Conversation[] = [
  {
    id: "1",
    contactName: "Alice Smith",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    lastMessage: "Hey, did you receive the encrypted files?",
    timestamp: "10:42 AM",
    unread: 2,
    isOnline: true,
    isEncrypted: true,
  },
  {
    id: "2",
    contactName: "Bob Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    lastMessage: "The key exchange was successful",
    timestamp: "Yesterday",
    unread: 0,
    isOnline: false,
    isEncrypted: true,
  },
  {
    id: "3",
    contactName: "Carol Williams",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carol",
    lastMessage: "Let me know when you get this",
    timestamp: "Yesterday",
    unread: 0,
    isOnline: true,
    isEncrypted: true,
  },
  {
    id: "4",
    contactName: "Dave Brown",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dave",
    lastMessage: "This message will expire in 1 hour",
    timestamp: "Monday",
    unread: 0,
    isOnline: false,
    isEncrypted: true,
  },
  {
    id: "5",
    contactName: "Eve Davis",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Eve",
    lastMessage: "Can we talk about the security protocol?",
    timestamp: "Sunday",
    unread: 0,
    isOnline: false,
    isEncrypted: true,
  },
  {
    id: "6",
    contactName: "Frank Miller",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Frank",
    lastMessage: "I sent you my public key",
    timestamp: "Last week",
    unread: 0,
    isOnline: false,
    isEncrypted: true,
  },
];

export default ConversationList;
