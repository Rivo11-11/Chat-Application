import React, { useState, useEffect ,useRef} from 'react';
import {useNavigate} from 'react-router-dom'
import axios from 'axios';
import { userRoute,usersRoute,host} from '../utils/apis';
import styled from 'styled-components';
import Contacts from '../components/contacts';
import Welcome from '../components/welcome';
import ChatContainer from '../components/chatContainer';
import Logout from '../components/logout';
import {io} from 'socket.io-client'
import MessageSound from '../assets/mes.mp3'

function Chat() {

  // useRef preservering values without causing rerenders opposite to the setState()
  const socket = useRef()

  const [user, setUser] = useState(null);
  const [cuurentChat,setCurrentChat] = useState({});
  const [contacts,setContacts] = useState([]);
  const navigate = useNavigate()
  const storedUserData = JSON.parse(localStorage.getItem('chat-app-user'));



  useEffect(() => {
    
    const fetchUserDetails = async () => {
      try {
        const { token } = storedUserData;
        const response = await axios.get(userRoute,{
          headers: {
            'Authorization': `${token}`,
          }});
        if (response.status === 200) 
        {
          // get one single item user that has id-image-name
          setUser(response.data);
  
        }
        else 
          navigate('/login')
      } catch (error) {
        console.error('Error fetching user details:', error);
        navigate('/login')
      }
    };
    fetchUserDetails();
  }, []); 

  useEffect(()=>{
    const fetchUsersDetails = async () => {
      try {
        const { token } = storedUserData;
        const response = await axios.get(usersRoute,{
          headers: {
            'Authorization': `${token}`,
          }});
        if (response.status === 200) 
        {
          // get list of the other user existed in the system ..each has id-name-image
          setContacts(response.data);
        }
     
      } catch (error) {
        console.error('Error fetching users details:', error);
      }
    };

  fetchUsersDetails();

  },[user])

  useEffect(()=>{
   if (user) 
    {
      socket.current = io(host) 
      socket.current.emit('add-user',user._id)
      socket.current.on("msg-receive", (msg) => {
        if (document.visibilityState === 'visible') {
          const sound = new Audio(MessageSound);
          sound.play();
        }
      });
    }

  },[user])



  
   // pass it to the contactComponent to handle the switch of the chat
  const handleChatChange = (contact) => {
    // will be executed in the contact component
    setCurrentChat(contact);
  };



   return (
     <>
    <Container>
      <Logout user = {user}/>
      <div className="container">
        
        <Contacts 
        contacts = {contacts} 
        user = {user}
        handleChat = {handleChatChange} // make the functional component contact handle the switch of the chat
        socket = {socket}
        />
        { 
        Object.keys(cuurentChat).length === 0 ? <Welcome user = {user}/> : <ChatContainer contact = {cuurentChat} user = {user} socket = {socket} />
        
      }   
      </div>
    </Container>
   
  </>
    );
        }

export default Chat;

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
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



