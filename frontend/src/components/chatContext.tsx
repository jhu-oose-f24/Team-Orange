import base_URL, getMessage from "../api/GetMessages";
import { createContext, useState, useEffect, useContext, useDebugValue } from "react";
import io from 'socket.io-client';


const socket: Socket = io(base_URL); 

interface Message { // change this 
    senderId: string;
    text: string;
}

interface UserChat {
    userId: string; // ID of the user in the chat
    messages: Message[]; // Array of messages in one chat
  }
  
interface ChatContextType {
    userChats: UserChat[] | null; // Current user's chats (with other users)
    chatLoading: boolean; // Loading state for chats
}
const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatContextProvider: React.FC<{ children: React.ReactNode; user: string | null }> = ({ children, user }) => {
    const [userChats,setUserChats] = useState<UserChat[] | null>(null);
    const [chatLoading, setChatLoading] = useState(false);
    
    // whenever a user change, we get a chat
    useEffect(() => {
        // check if user exist (get all the chats for that user)
        if (user) {
            setChatLoading(true); 
      
            const fetchUserChats = async () => {
              try {
                const response = await fetch(`/api/chats/${user}`); // chnage this 
                const data = await response.json();
                
                setUserChats(data); // Set fetched chats
              } catch (error) {
                console.error('Error fetching user chats:', error);
                setUserChats([]); 
              } finally {
                setChatLoading(false); // Set loading to false after fetching
              }
            };
      
            fetchUserChats();
        } else {
            setUserChats(null); // Reset chats if no user is logged in
            setChatLoading(false); // Stop loading if no user
        }

    },[user])
    return (
        <ChatContext.Provider 
           value={{ userChats, chatLoading }}>
          {children}
        </ChatContext.Provider>
      );
};

export const useChat = (): ChatContextType => {
    const context = useContext(ChatContext);
    if (!context) {
      throw new Error('useChat must be used within a ChatContextProvider');
    }
    return context;
};








