import React from "react";
import styled from "styled-components";
import Square from "./Square";

// Styled Component for the Board
const StyledBoard = styled.div`
    display: grid;
    grid-template-columns: repeat(8, 60px);
    gap: 0;
    border: 2px solid #333;
    margin: auto;
    background-color: #1e1e1e;
`;

const Board = ({ board, onMove, selectedChecker }) => {
    const getIsSelected = (row, col) => {
        return (
            selectedChecker &&
            selectedChecker.row === row &&
            selectedChecker.col === col
        );
    };

    return (
        <StyledBoard>
            {board.map((row, rowIndex) =>
                row.map((square, colIndex) => (
                    <Square
                        key={`${rowIndex}-${colIndex}`}
                        value={square} // Checker object or null
                        isDark={(rowIndex + colIndex) % 2 === 1} // Dark square for alternate coloring
                        isSelected={getIsSelected(rowIndex, colIndex)} // Highlight selected square
                        onClick={() => onMove(rowIndex, colIndex)}
                    />
                ))
            )}
        </StyledBoard>
    );
};

export default Board;
