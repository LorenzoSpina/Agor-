import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../../assets/robot.gif";
import { decrypt } from "../../utils/decrypted_value";

export default function Welcome() {

  const [userName, setUserName] = useState("");
  
  useEffect( () => {
    let data = null
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      data = decrypt(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))
      setUserName(
        JSON.parse(data).username
      );
    } else {
      data = decrypt(sessionStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))
      setUserName(
        JSON.parse(data).username
      );
    }
  }, []);
  return (
    <Container>
      <img src={Robot} alt="" />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
`;
