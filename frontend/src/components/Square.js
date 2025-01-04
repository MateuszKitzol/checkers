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
    border: ${(props) => (props.isSelected ? "2px solid yellow" : "none")};
    cursor: ${(props) => (props.hasBlueChecker ? "pointer" : "default")};
`;

const Square = ({ value, isDark, isSelected, onClick }) => {
    const hasBlueChecker = value && value.player === "P2";

    return (
        <StyledSquare
            isDark={isDark}
            isSelected={isSelected}
            hasBlueChecker={hasBlueChecker}
            onClick={onClick}
        >
            {value ? <Checker player={value.player} isKing={value.isKing} /> : ""}
        </StyledSquare>
    );
};

export default Square;
