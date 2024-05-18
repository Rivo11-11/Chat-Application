import React, { useState,useEffect} from 'react'
import { Link,useNavigate} from 'react-router-dom' // Import the Link component from react-router-dom
import Logo from "../assets/discord-icon.svg";
import styled from "styled-components"; 
import { toast } from 'react-toastify';
import axios from "axios"
import {registerRoute} from '../utils/apis'




const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;

    img {
      height: 5rem;
    }

    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }

  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;

    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  .password-container {
    position: relative;
    display: flex;
    align-items: center;
    width: 110%; /* Fix: Give the password-container a fixed width */
    
   
    .eye-icon {
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      cursor: pointer;
      border: none;
      background: none;
      color: #4e0eff;
      font-size: 16px;
      line-height: 1;
      padding: 0 0.5rem;
    }
  }
  


  



  button {
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

  span {
    color: white;
    text-transform: uppercase;

    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
  ` 


export default function Register() {
  const toastOptions = {
    position: "bottom-right",
    autoClose: 1000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    show_password : false ,
    show_confirm_password : false ,
  });
  const navigate = useNavigate()
 

  const handleSubmit = async (e) => {
    e.preventDefault()
    const {username,email,password,confirmPassword} = values
    

    try {
      if (handleValidate()) {
        const response = await axios.post(registerRoute, {
          name: username,
          email: email,
          password: password,
          confirmPassword: confirmPassword,
        });
        // save the credentials name and email in local storage
        console.log(JSON.stringify(response.data))
        toast.success('User created successfully',toastOptions);
        localStorage.setItem("chat-app-user",JSON.stringify(response.data))
        navigate("/avatar")
      }
    } catch (error) {
      if (error.response) {
        const message = error.response.data.msg;
        toast.error(message,toastOptions);
       
    }
   
  }
}

  const handleValidate = () => {
   

  
    // Check if any field is empty
    if (!values.username || !values.email || !values.password || !values.confirmPassword) {
      toast.error("All fields are required", toastOptions);
      return;
    }
  
    // Validate username length
    if (values.username.length < 3 || values.username.length > 8) {
      toast.error("Username must be between 3 and 8 characters", toastOptions);
      return;
    }
  
    // Validate password length and complexity
    if (values.password.length < 8 || !/(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}/.test(values.password)) {
      toast.error("Password must be at least 8 characters with a combination of uppercase, lowercase, and digits", toastOptions);
      return;
    }
  
    // Validate password and confirm password match
    if (values.password !== values.confirmPassword) {
      toast.error("Confirm Password does not match the Password", toastOptions);
      return;
    }
  
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(values.email)) {
      toast.error("Invalid email format", toastOptions);
      return;
    }
    return true
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleTogglePassword = () => {
      setValues({ ...values, show_password: !values.show_password });
   
  };

  const handleToggleConfirmPassword = () => {

    setValues({ ...values, show_confirm_password: !values.show_confirm_password });
   
  }

  useEffect(()=>{
    if(localStorage.getItem("chat-app-user"))
    navigate('/')
  },[])
  

  return (
    <>
    
      <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)} noValidate>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>Chatty</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={values.username}
            onChange={(e) => handleChange(e)}
            
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={values.email}
            onChange={(e) => handleChange(e)}
          />
          <div className="password-container">
          <input
            type={values.show_password ? 'text' : 'password'}
            placeholder="Password"
            name="password"
            value={values.password}
            onChange={(e) => handleChange(e)}
          />
            <button
        type="button"
        className="eye-icon"
        onClick={() => handleTogglePassword()}
      >
        {values.show_password ? '👁️' : '🔒'}
      </button>
      </div>
         
        <div className="password-container">
          <input
            type={values.show_confirm_password ? 'text' : 'password'}
            placeholder="Confirm Password"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={(e) => handleChange(e)}
          />
              <button
        type="button"
        className="eye-icon"
        onClick={() => handleToggleConfirmPassword()}
      >
        {values.show_confirm_password ? '👁️' : '🔒'}
      </button>
        </div>

          <button type="submit">Create User</button>
          <span>
            Already have an account ? <Link to="/login">Login.</Link>
          </span>
        </form>
      </FormContainer>
      
      
    </>
  );
  
}


  
