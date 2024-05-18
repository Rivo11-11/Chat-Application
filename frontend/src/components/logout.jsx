import React from "react";
import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";
import styled from "styled-components";
import axios from "axios";
import {io} from 'socket.io-client'
import {host} from '../utils/apis';

export default function Logout({user}) {
  const navigate = useNavigate();
  const handleClick = async () => {
   localStorage.clear()
   navigate('/login')
   const socket = io(host); 
   socket.emit('logout', user._id); 
  };
  return (
    <Button onClick={handleClick}>
      <BiPowerOff />
    </Button>
  );
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: end;
  padding: 0.9rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;