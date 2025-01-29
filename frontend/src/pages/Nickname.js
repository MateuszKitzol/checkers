import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const NicknameWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #121212;
    color: #e4e4e4;
`;

const Title = styled.h1`
    font-size: 2.5rem;
    margin-bottom: 20px;
`;

const Input = styled.input`
    padding: 10px;
    font-size: 16px;
    border: 2px solid #1f78d1;
    border-radius: 5px;
    margin-bottom: 20px;
    width: 200px;
    outline: none;
    background-color: #2c2c2c;
    color: white;
`;

const ConfirmButton = styled.button`
    padding: 10px 20px;
    background-color: #1f78d1;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 18px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #155a99;
    }
`;

const Nickname = () => {
    const [nickname, setNickname] = useState("");
    const navigate = useNavigate();

    const handleConfirm = () => {
        console.log("handleConfirm")
        if (nickname.trim()) {
            console.log("handleConfirm2")
            localStorage.setItem("nickname", nickname); // Zapisanie nicku w localStorage
            console.log("navigating")
            navigate("/rooms"); // Przekierowanie do listy pokoi
        } else {
            alert("Please enter a valid nickname.");
        }
    };

    return (
        <NicknameWrapper>
            <Title>Enter Your Nickname</Title>
            <Input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Your nickname"
            />
            <ConfirmButton onClick={handleConfirm}>Confirm</ConfirmButton>
        </NicknameWrapper>
    );
};

export default Nickname;
