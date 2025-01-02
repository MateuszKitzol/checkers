import React, { useState } from "react";
import styled from "styled-components";
import Board from "../components/Board";

// Styled Components
const GameWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 2rem;
    text-align: center;
`;

const BoardWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    background-color: #2c2c2c;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
`;

const Game = () => {
    const [board, setBoard] = useState(
        Array(8)
            .fill(null)
            .map(() => Array(8).fill(null))
    );

    const handleMove = (row, col) => {
        console.log(`Move at row ${row}, col ${col}`);
        const newBoard = board.map((r, rowIndex) =>
            r.map((square, colIndex) => {
                if (rowIndex === row && colIndex === col) {
                    return "P1"; // Placeholder for player move
                }
                return square;
            })
        );
        setBoard(newBoard);
    };

    return (
        <GameWrapper>
            <BoardWrapper>
                <Board board={board} onMove={handleMove} />
            </BoardWrapper>
        </GameWrapper>
    );
};

export default Game;


