import React, {useContext, useState } from 'react';
import { useChat} from './ChatContext'; 
import { Container } from 'react-bootstrap';

const Chat = () =>{
    const {userChats, chatLoading} = useChat();
    if (!userChats) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    if (!userChats || userChats.length === 0) {
        return <div>No chats available.</div>;
    }

    console.log(userChats); // show the chats for the current user(login / mock)
    return <>Chat</>
}

export default Chat;

