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

const initializeBoard = () => {
    const board = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));

    // Add Player 1's checkers
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 8; col++) {
            if ((row + col) % 2 === 1) {
                board[row][col] = { player: "P1", isKing: false }; // Player 1 pieces
            }
        }
    }

    // Add Player 2's checkers
    for (let row = 5; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if ((row + col) % 2 === 1) {
                board[row][col] = { player: "P2", isKing: false }; // Player 2 pieces
            }
        }
    }

    return board;
};

const Board = ({ onMove }) => {
    const board = initializeBoard();

    return (
        <StyledBoard>
            {board.map((row, rowIndex) =>
                row.map((square, colIndex) => (
                    <Square
                        key={`${rowIndex}-${colIndex}`}
                        value={square} // Checker object or null
                        isDark={(rowIndex + colIndex) % 2 === 1} // Dark square for alternate coloring
                        onClick={() => onMove(rowIndex, colIndex)}
                    />
                ))
            )}
        </StyledBoard>
    );
};

export default Board;
