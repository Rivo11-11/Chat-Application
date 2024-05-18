import React from 'react'
import { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import loader from '../assets/loader.gif'
import {Buffer} from  'buffer/'
import { setAvatarRoute } from '../utils/apis';
import { toast } from 'react-toastify';
import axios  from 'axios';



export default function Avatar() {
  const api = `https://api.multiavatar.com/4645646`;
  const navigate = useNavigate();
  const [values,setValues] = useState({
    avatars : [] ,
    isLoading : true ,
    selectedAvatar : undefined ,
  })
  const toastOptions = {
    position: "bottom-right",
    autoClose: 1000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {

    const chatAppUser = localStorage.getItem('chat-app-user');

    if (!chatAppUser) {
      navigate('/login');
      return;
    }

    if (JSON.parse(chatAppUser).setAvatar === true) {
      navigate('/');
      return;
    }
    const fetchData = async () => {
      try {
        const data = [];
        for (let i = 0; i < 3; i++) {
          const response = await axios.get(`${api}/${Math.round(Math.random() * 10)}`, {
            responseType: 'arraybuffer',
          });
          const buffer = Buffer.from(response.data, 'binary');
          data.push(buffer.toString('base64'));


        }
        setValues({ ...values, avatars: data, isLoading: false });
      } catch (error) {
        console.error('Error fetching avatars:', error);
      }
    };

    fetchData();
  }, []); 

 

  const setProfilePicture = async () => {
    if (values.selectedAvatar === undefined)
    {
    toast.error('Please select a profile picture avatar',toastOptions)
    return
    }


    const response = await axios.post(setAvatarRoute,{
      image: values.avatars[values.selectedAvatar] ,
      token : JSON.parse(localStorage.getItem('chat-app-user')).token,
    });
    if (response.status === 201) 
    {
    toast.success('Your Avatar is yammy ',toastOptions)
    navigate('/')
    localStorage.setItem('chat-app-user', JSON.stringify({
      ...JSON.parse(localStorage.getItem('chat-app-user')),
      setAvatar: true,
    }));
    }
    else 
      toast.error('Unexpected Error ',toastOptions)

  }
  const setSelectedAvatar = (index) => {
        setValues({...values , selectedAvatar : index})
  }
    
  return (
    <>
      {values.isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Pick an Avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {values.avatars.map((avatar, index) => {
              return (
                <div key={index}
                  className={`avatar ${values.selectedAvatar === index ? "selected" : ""
                  }`}
                >
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                    key={avatar}
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            })}
          </div>
          <button onClick={setProfilePicture} className="submit-btn">
            Set as Profile Picture
          </button>
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content:center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
`;

