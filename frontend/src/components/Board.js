import React from "react";
import styled from "styled-components";
import Square from "./Square";

// Styled component for the board
const StyledBoard = styled.div`
    display: grid;
    grid-template-columns: repeat(8, 50px);
    gap: 2px;
    background-color: ${(props) => props.backgroundColor || "#ddd"};
    border: 2px solid black;
    padding: 10px;
    margin: auto;
`;

// Wrapper for the board (optional, for centering and spacing)
const BoardWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 20px;
`;

const Board = ({ board, onMove, isGameOver }) => {
    return (
        <BoardWrapper>
            <StyledBoard>
                {board.map((row, rowIndex) =>
                    row.map((square, colIndex) => (
                        <Square
                            key={`${rowIndex}-${colIndex}`}
                            value={square}
                            onClick={() => onMove(rowIndex, colIndex)}
                        />
                    ))
                )}
            </StyledBoard>
        </BoardWrapper>
    );
};

export default Board;

