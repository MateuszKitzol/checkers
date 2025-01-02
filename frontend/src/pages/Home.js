import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

// Styled Components
const HomeWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
    padding: 2rem;
`;

const StartButton = styled(Link)`
    display: inline-block;
    padding: 0.75rem 1.5rem;
    font-size: 1.25rem;
    color: white;
    background-color: #1f78d1;
    border: none;
    border-radius: 4px;
    text-decoration: none;
    transition: background-color 0.3s;
    cursor: pointer;

    &:hover {
        background-color: #155a99;
    }
`;

const Home = () => {
    return (
        <HomeWrapper>
            <h1>Welcome to the Checkers Game</h1>
            <p>Click below to start a game!</p>
            <StartButton to="/game">Start Game</StartButton>
        </HomeWrapper>
    );
};

export default Home;
