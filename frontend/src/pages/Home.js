import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const HomeWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #121212;
    color: #e4e4e4;
`;

const StartButton = styled(Link)`
    padding: 10px 20px;
    background-color: #1f78d1;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    font-size: 18px;
    margin-top: 20px;
    transition: background-color 0.3s;

    &:hover {
        background-color: #155a99;
        color: white; /* Utrzymanie koloru tekstu */
    }
`;


const Home = () => {
    return (
        <HomeWrapper>
            <h1>Welcome to Checkers Game</h1>
            <StartButton to="/nickname">Start The Game!</StartButton>
        </HomeWrapper>
    );
};


export default Home;
