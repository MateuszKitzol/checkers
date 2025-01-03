import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Board from "../components/Board";

// Styled Components
const GameWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 2rem;
    background-color: #1e1e1e;
    color: #e4e4e4;
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

const NicknameDisplay = styled.div`
    margin-top: 20px;
    padding: 10px;
    background-color: ${(props) => (props.isOpponent ? "#d9534f" : "#1f78d1")};
    color: white;
    border-radius: 5px;
    font-size: 18px;
    text-align: center;
    width: 100%;
    max-width: 400px;
`;

const OpponentWrapper = styled.div`
    width: 100%;
    max-width: 400px;
    margin-bottom: 20px;
`;

// Initialize the board with checkers
const initializeBoard = () => {
    const board = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));

    // Player 1 checkers
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 8; col++) {
            if ((row + col) % 2 === 1) {
                board[row][col] = { player: "P1", isKing: false };
            }
        }
    }

    // Player 2 checkers
    for (let row = 5; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if ((row + col) % 2 === 1) {
                board[row][col] = { player: "P2", isKing: false };
            }
        }
    }

    return board;
};

const Game = () => {
    const [board, setBoard] = useState(initializeBoard());
    const [selectedChecker, setSelectedChecker] = useState(null);
    const [nickname, setNickname] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const savedNickname = localStorage.getItem("nickname");
        if (savedNickname) {
            setNickname(savedNickname);
        } else {
            navigate("/nickname"); // Przekierowanie, jeśli brak nicku
        }
    }, [navigate]);

    const handleSquareClick = (row, col) => {
        const checker = board[row][col];

        if (selectedChecker) {
            const isDiagonalMove =
                Math.abs(selectedChecker.row - row) === 1 &&
                Math.abs(selectedChecker.col - col) === 1;

            const isCaptureMove =
                Math.abs(selectedChecker.row - row) === 2 &&
                Math.abs(selectedChecker.col - col) === 2;

            const isMovingForward =
                (selectedChecker.player === "P1" && row > selectedChecker.row) ||
                (selectedChecker.player === "P2" && row < selectedChecker.row) ||
                selectedChecker.isKing;

            if (isDiagonalMove && isMovingForward && board[row][col] === null) {
                // Normal move
                moveChecker(row, col);
            } else if (isCaptureMove && isMovingForward) {
                // Capture move
                const middleRow = (selectedChecker.row + row) / 2;
                const middleCol = (selectedChecker.col + col) / 2;
                const middleChecker = board[middleRow][middleCol];

                if (middleChecker && middleChecker.player !== selectedChecker.player) {
                    // Perform the capture
                    captureChecker(row, col, middleRow, middleCol);
                } else {
                    setSelectedChecker(null); // Invalid move
                }
            } else {
                setSelectedChecker(null); // Invalid move
            }
        } else if (checker) {
            setSelectedChecker({ ...checker, row, col }); // Select a checker
        }
    };

    const moveChecker = (row, col) => {
        const newBoard = board.map((r, rowIndex) =>
            r.map((square, colIndex) => {
                if (rowIndex === selectedChecker.row && colIndex === selectedChecker.col) {
                    return null; // Clear the original position
                }
                if (rowIndex === row && colIndex === col) {
                    return selectedChecker; // Place the checker in the new position
                }
                return square;
            })
        );

        // Check for king promotion
        if (row === 0 && selectedChecker.player === "P2") {
            selectedChecker.isKing = true;
        } else if (row === 7 && selectedChecker.player === "P1") {
            selectedChecker.isKing = true;
        }

        setBoard(newBoard);
        setSelectedChecker(null); // Deselect checker after move
    };

    const captureChecker = (row, col, middleRow, middleCol) => {
        const newBoard = board.map((r, rowIndex) =>
            r.map((square, colIndex) => {
                if (rowIndex === selectedChecker.row && colIndex === selectedChecker.col) {
                    return null; // Clear the original position
                }
                if (rowIndex === middleRow && colIndex === middleCol) {
                    return null; // Remove the captured checker
                }
                if (rowIndex === row && colIndex === col) {
                    return selectedChecker; // Place the checker in the new position
                }
                return square;
            })
        );

        // Check for king promotion
        if (row === 0 && selectedChecker.player === "P2") {
            selectedChecker.isKing = true;
        } else if (row === 7 && selectedChecker.player === "P1") {
            selectedChecker.isKing = true;
        }

        setBoard(newBoard);

        // Check for further captures
        const canCaptureAgain = checkForAdditionalCaptures(row, col);
        if (canCaptureAgain) {
            setSelectedChecker({ ...selectedChecker, row, col });
        } else {
            setSelectedChecker(null); // Deselect checker if no further captures are possible
        }
    };

    const checkForAdditionalCaptures = (row, col) => {
        const directions = [
            [-2, -2],
            [-2, 2],
            [2, -2],
            [2, 2],
        ];

        for (const [rowOffset, colOffset] of directions) {
            const newRow = row + rowOffset;
            const newCol = col + colOffset;
            const middleRow = row + rowOffset / 2;
            const middleCol = col + colOffset / 2;

            // Ensure within bounds
            if (
                newRow >= 0 &&
                newRow < 8 &&
                newCol >= 0 &&
                newCol < 8 &&
                board[newRow][newCol] === null
            ) {
                const middleChecker = board[middleRow][middleCol];
                if (middleChecker && middleChecker.player !== selectedChecker.player) {
                    return true; // Further capture is possible
                }
            }
        }

        return false;
    };

    return (
        <GameWrapper>
            <OpponentWrapper>
                <NicknameDisplay isOpponent={true}>Opponent: TBD</NicknameDisplay>
            </OpponentWrapper>
            <BoardWrapper>
                <Board
                    board={board}
                    onMove={handleSquareClick}
                    selectedChecker={selectedChecker}
                />
            </BoardWrapper>
            <NicknameDisplay>{nickname}</NicknameDisplay>
        </GameWrapper>
    );
};

export default Game;
