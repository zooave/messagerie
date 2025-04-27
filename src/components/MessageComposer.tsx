import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Lock, Send, Clock, Shield } from "lucide-react";

interface MessageComposerProps {
  onSendMessage?: (message: string, expirationTime?: string) => void;
  encryptionStatus?: "secure" | "pending" | "error";
  recipientPublicKey?: string;
}

const MessageComposer = ({
  onSendMessage = () => {},
  encryptionStatus = "secure",
  recipientPublicKey = "abc123...",
}: MessageComposerProps) => {
  const [message, setMessage] = useState("");
  const [expirationTime, setExpirationTime] = useState<string>("none");

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(
        message,
        expirationTime !== "none" ? expirationTime : undefined,
      );
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full p-4 border-t bg-background flex flex-col gap-2">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          {encryptionStatus === "secure" ? (
            <>
              <Lock className="h-3 w-3 text-green-500" />
              <span className="text-green-500">End-to-end encrypted</span>
            </>
          ) : encryptionStatus === "pending" ? (
            <>
              <Shield className="h-3 w-3 text-amber-500" />
              <span className="text-amber-500">
                Establishing secure connection...
              </span>
            </>
          ) : (
            <>
              <Shield className="h-3 w-3 text-red-500" />
              <span className="text-red-500">Encryption error</span>
            </>
          )}
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-5 px-1">
                Key info
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">
                Recipient public key: {recipientPublicKey}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex items-center gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a secure message..."
          className="flex-1"
        />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Select
                  value={expirationTime}
                  onValueChange={setExpirationTime}
                >
                  <SelectTrigger className="w-[130px]">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <SelectValue placeholder="No expiration" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No expiration</SelectItem>
                    <SelectItem value="30s">30 seconds</SelectItem>
                    <SelectItem value="1m">1 minute</SelectItem>
                    <SelectItem value="5m">5 minutes</SelectItem>
                    <SelectItem value="1h">1 hour</SelectItem>
                    <SelectItem value="24h">24 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Set message expiration time</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button
          onClick={handleSendMessage}
          disabled={!message.trim() || encryptionStatus === "error"}
        >
          <Send className="h-4 w-4 mr-2" />
          Send
        </Button>
      </div>
    </div>
  );
};

export default MessageComposer;
