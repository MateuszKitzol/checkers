import React from "react";
import styled from "styled-components";

// Styled component for the checker
const StyledChecker = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: ${(props) => (props.player === "P1" ? "red" : "blue")};
    border: ${(props) => (props.isKing ? "3px solid gold" : "2px solid white")};
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: ${(props) => (props.isKing ? "1.2rem" : "0")};
    color: white;
`;

const Checker = ({ player, isKing }) => {
    return (
        <StyledChecker player={player} isKing={isKing}>
            {isKing ? "K" : ""}
        </StyledChecker>
    );
};

export default Checker;
