import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/discord-icon.svg";
import { IoIosCheckmarkCircle,IoIosCloseCircle } from 'react-icons/io';
import {io} from 'socket.io-client'
import {host} from '../utils/apis';
export default function Contacts({user,contacts,handleChat}) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [color,setColor] = useState(undefined)
  
  const [onlineUsers, setOnlineUsers] = useState(new Map());

  useEffect(()=>{
    if (user) {
      setCurrentUserName(user.name)
      setCurrentUserImage(user.AvatarImage)
      
    }

  },[user])
  useEffect(() => {
    const socket = io(host);
    if (socket) {
      socket.on("online-users", (onlineUserList) => {
        const onlineUsersMap = new Map(
          onlineUserList.map((userId) => [userId, true])
        );
        setOnlineUsers(onlineUsersMap);
        console.log(onlineUserList);
      });
    }

  }, []);
  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    handleChat(contact)
   
  };
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      
        <Container>
        <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>Chatty</h3>
          </div>
          <div className="contacts">
          <input
        className="search-input"
        type="text"
        placeholder="Search contacts..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
           {filteredContacts.map((contact, index) => {
              const isOnline = onlineUsers.has(contact._id);
              console.log(isOnline)
              return (
                <div
                  key={index}
                  className={`contact ${
                    index === currentSelected ? "selected" : ""
                  }`}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  <div className="avatar">
                    <img
                      src={`data:image/svg+xml;base64,${contact.AvatarImage}`}
                      alt=""
                    />
                  </div>
                  <div className="username">
                    <h3>  
                      {contact.name} 
                      {isOnline ? (
      <IoIosCheckmarkCircle className="status-icon online" />
    ) : (
      <IoIosCloseCircle className="status-icon offline" />
    )}
                    
                    </h3>
                  </div>
                </div>
              );
            })}
            
          </div>
          
          <div className="current-user">
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="avatar"
              />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>
      
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #080420;

  
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 2rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }

  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .search-input {
      width: 90%;
      height: 1.5rem;
      padding: 1.2rem;
      border: none;
      border-radius: 0.35rem;
      background-color: #ffffff34;
      color: white;
      font-size: 1rem;
      margin-bottom: 1rem;
      outline: none;
      transition: background-color 0.3s ease;
    
      &::placeholder {
        color: white;
      }
    
      &:focus {
        background-color: #ffffff6e;
      }
    }
    .contact {
      background-color: #ffffff34;
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
        .status-icon {
          display: inline-block;
          vertical-align: middle;
          margin-left: 5px; /* Adjust as needed */
        }
        
        .online {
          color: green;
        }
        
        .offline {
          color: red;
        }
      
      }
    }
    .selected {
      background-color: #9a86f3;
    }
  }

  .current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        color: white;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;
