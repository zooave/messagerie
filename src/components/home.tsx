import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import ConversationList from "./ConversationList";
import ChatArea from "./ChatArea";
import AuthScreen from "./AuthScreen";

interface HomeProps {
  authenticated?: boolean;
}

const Home = ({ authenticated = false }: HomeProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(authenticated);
  const [darkMode, setDarkMode] = useState(true);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);

  const handleLogin = () => {
    // In a real app, this would verify credentials
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveConversationId(null);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleConversationSelect = (conversationId: string) => {
    setActiveConversationId(conversationId);
  };

  if (!isAuthenticated) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}
      >
        <AuthScreen onLogin={handleLogin} darkMode={darkMode} />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}
    >
      <header className="p-4 flex justify-between items-center border-b border-gray-700">
        <h1 className="text-xl font-bold">Encrypted Messaging</h1>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-[350px] border-r border-gray-700">
          <ConversationList
            onSelectConversation={handleConversationSelect}
            activeConversationId={activeConversationId}
            darkMode={darkMode}
          />
        </div>
        <div className="flex-1">
          {activeConversationId ? (
            <ChatArea
              conversationId={activeConversationId}
              darkMode={darkMode}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <Card
                className={`p-6 max-w-md ${darkMode ? "bg-gray-800" : "bg-white"}`}
              >
                <h2 className="text-xl font-semibold mb-2">
                  Select a conversation
                </h2>
                <p className="text-gray-400">
                  Choose an existing conversation or start a new one to begin
                  messaging securely.
                </p>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
