import React, { useState, useEffect,useRef } from "react";
import styled from "styled-components";
import ChatInput from "./chatInput";
import axios from "axios";
import { sendMessageRoute,getMessageRoute } from "../utils/apis";
import {v4 as uuidv4} from "uuid"
import MessageSound from '../assets/mes.mp3'


function ChatContainer({contact,user,socket}) {
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [messages, setMessages] = useState([]);
    const scrollRef = useRef();


    useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-receive", (msg,receiver) => {
        if (receiver === contact._id) 
          {
        setArrivalMessage({ fromSelf: false, message: msg });
          }
        const sound = new Audio(MessageSound)
        sound.play()
      });
      
    }
  }, []);
  useEffect(() => {
    // when an arrival message is coming .. set it in the messages to render immediately 
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, 
  [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
    useEffect(()=>{
      const fetchMessages = async () =>
      {
        try {

           const response = await axios.post(getMessageRoute,{

                    from: user._id, 
                    to: contact._id
                
           })
           
           setMessages(response.data)

        } catch (e) {
          console.log("error in fetchMessages : ",e)
        }

      } 
      // fetch the messages of a contact when a contact is changed..A contact is changed in the Contacts Component
      fetchMessages()

    },[contact])

  

    // will be called from the chatInput Component
    const handleSendMsg = async (msg) =>{
   
     await axios.post(sendMessageRoute,{
      from : user._id ,
      to : contact._id ,
      msg : msg

      })
      socket.current.emit('send-msg',{
        to : contact._id ,
        from : user._id, 
        msg : msg
      })
    // i need to keep track of the new message sent by me to be also a real time
    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
     }

    return (
        <Container>
          <div className="chat-header">
            <div className="user-details">
              <div className="avatar">
                <img
                  src={`data:image/svg+xml;base64,${contact.AvatarImage}`}
                  alt=""
                />
              </div>
              <div className="username">
                <h3>{contact.name}</h3>
              </div>
            </div>
          </div>
          <div className="chat-messages"> 
          {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${
                  message.fromSelf ? "sended" : "recieved"
                }`}
              >
                <div className="content ">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })}
          </div>
          <ChatInput handleSendMsg = {handleSendMsg}/>
        </Container>
   
  )
}


const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;


export default ChatContainer
