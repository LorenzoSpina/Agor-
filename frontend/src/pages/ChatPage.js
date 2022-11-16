import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIchat";
import Contacts from '../components/chat/Contacts'
import Welcome from "../components/chat/Welcome";
import ChatContainer from '../components/chat/ChatContainer'
import SideDrawer from "../components/miscellanous/SideDrawer";
import ErrorPage from './ErrorPage'
import { decrypt } from "../utils/decrypted_value";



const ChatPage = () => {
  const socket = useRef();
  const location = useLocation()

  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);

  const [error, setError] = React.useState()

  useEffect( () => {
    let data = null
    if (!sessionStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
        setError(401)
      } else {
        data = decrypt(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))
        setCurrentUser(JSON.parse(data))
      }
    } else {
      data = decrypt(sessionStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))
      setCurrentUser(JSON.parse(data))
      try {
        setCurrentChat(location.state.user)
      } catch (error) {
        setCurrentChat(undefined)
      }
      
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    
    if (currentUser) {
      socket.current = io(host)
      if(socket.current){
        
        socket.current.emit("add-user", currentUser._id)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentUser) {
      axios
        .get(`${allUsersRoute}`)
        .then((res) => {
          const data = res.data
          let newData = null
          if(currentUser.data.username)
            newData = data.filter(data => data.username !== currentUser.data.username)
          else
            newData = data.filter(data => data.name !== currentUser.data.name)       
          setContacts(newData)
        });
    }
  }, [currentUser]);

  const handleChatChange = (chat) => {
    if(chat.username)
      setCurrentChat(chat.username)
    else
      setCurrentChat(chat.name)
  };
  
  
  if(!currentUser){
    return (
      <>
        <SideDrawer />
        <ErrorPage error={error} />
      </>
    )
  }
  else{
    return(
      <>
        <SideDrawer />
        <Container>
          <div className="container">
            <Contacts contacts={contacts} changeChat={handleChatChange} />
            {(currentChat === undefined) ? (
              <Welcome />
            ) : (                                                       
              <ChatContainer currentChat={currentChat} socket={socket} />
            )}
          </div>
        </Container>
      </>
    )
  }

}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  padding-top: 64px;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;


export default ChatPage