import React from "react";
import styled from "styled-components";
import Checker from "./Checker";

// Styled Component for a Square
const StyledSquare = styled.div`
    width: 60px;
    height: 60px;
    background-color: ${(props) => (props.isDark ? "#3b3b3b" : "#f4f4f4")};
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Square = ({ value, isDark, onClick }) => {
    return (
        <StyledSquare isDark={isDark} onClick={onClick}>
            {value ? <Checker player={value.player} isKing={value.isKing} /> : ""}
        </StyledSquare>
    );
};

export default Square;
