import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import Board from "../components/Board";
import connection from "../signalr";

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
    background-color: ${(props) => (props.isPlayerTurn ? "#1f78d1" : "#d9534f")};
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
    transition: background-color 0.3s;
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

const GameOverOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8); // Semi-transparent black
    display: ${(props) => (props.visible ? "flex" : "none")}; // Show or hide
    justify-content: center;
    align-items: center;
    z-index: 1000;
    color: white;
    font-size: 2rem;
    text-align: center;
`;

const GameOverMessageBox = styled.div`
    background-color: #222; // Darker box for the message
    padding: 20px 40px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
    text-align: center;
`;

const GameOverButton = styled.button`
    margin: 10px;
    padding: 10px 20px;
    font-size: 1rem;
    color: white;
    background-color: #1f78d1;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #155a99; // Darker blue on hover
    }
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
    const { roomId } = useParams();
    const [board, setBoard] = useState(initializeBoard());
    const [selectedChecker, setSelectedChecker] = useState(null);
    const [nickname, setNickname] = useState("");
    const [opponent, setOpponent] = useState("");
    const [isPlayerTurn, setIsPlayerTurn] = useState(false); // Default to false to prevent assumption
    const [gameOverMessage, setGameOverMessage] = useState(""); // Stores the game-over message
    const navigate = useNavigate();

    useEffect(() => {
        if (!connection) return;

        // Start SignalR connection if not already started
        if (connection.state === "Disconnected") {
            connection.start().then(() => {
                console.log("[DEBUG] SignalR connection started");
            });
        }

        // Log ConnectionId for debugging
        console.log("[DEBUG] SignalR ConnectionId:", connection.connectionId);

        // Listen for players joining and the initial turn
        connection.on("PlayerJoined", (players, currentTurn) => {
            console.log("[DEBUG] Players in room:", players);
            console.log("[DEBUG] Current turn:", currentTurn);

            const opponentName = players.find((name) => name !== nickname);
            setOpponent(opponentName || "");

            // Use ConnectionId for turn sync
            setIsPlayerTurn(currentTurn === connection.connectionId);
        });

        // Listen for turn updates
        connection.on("UpdateTurn", (currentTurn) => {
            console.log("[DEBUG] Turn updated to:", currentTurn);
            setIsPlayerTurn(currentTurn === connection.connectionId);
        });

        // Listen for move events
        connection.on("ReceiveMove", (move, playerId, isCapture, captureRow, captureCol) => {
            console.log("[DEBUG] Move received:", move, "Player who made the move:", playerId);

            // Check if the move was made by the opponent
            const isOpponentMove = playerId !== connection.connectionId;

            const adjustedMove = isOpponentMove
                ? {
                    fromRow: 7 - move.fromRow,
                    fromCol: 7 - move.fromCol,
                    toRow: 7 - move.toRow,
                    toCol: 7 - move.toCol,
                    isKing: move.isKing,
                }
                : move;

            const adjustedCaptureRow = isOpponentMove ? 7 - captureRow : captureRow;
            const adjustedCaptureCol = isOpponentMove ? 7 - captureCol : captureCol;

            setBoard((prevBoard) => {
                const newBoard = prevBoard.map((row) => [...row]);

                // Update the board based on the move
                newBoard[adjustedMove.fromRow][adjustedMove.fromCol] = null;
                newBoard[adjustedMove.toRow][adjustedMove.toCol] = {
                    player: isOpponentMove ? "P1" : "P2", // Assign based on who made the move
                    isKing: adjustedMove.isKing,
                };

                // Remove the captured checker if it's a capture move
                if (isCapture) {
                    newBoard[adjustedCaptureRow][adjustedCaptureCol] = null;
                }

                return newBoard;
            });

            console.log(
                "[DEBUG] Move applied as",
                isOpponentMove ? "opponent's move" : "player's own move"
            );
        });


        // Cleanup events on unmount
        return () => {
            connection.off("PlayerJoined");
            connection.off("UpdateTurn");
            connection.off("ReceiveMove");
        };
    }, [connection, nickname]);


    useEffect(() => {
        const savedNickname = localStorage.getItem("nickname");
        if (savedNickname) {
            setNickname(savedNickname);

            // Join the room
            connection.invoke("JoinRoom", roomId, savedNickname).catch((err) => {
                console.error("[DEBUG] Error joining room:", err);
            });
        } else {
            navigate("/nickname");
        }
    }, [roomId, navigate]);

    const handleSquareClick = (row, col) => {
        if (!isPlayerTurn) {
            console.log("[DEBUG] Not your turn.");
            return;
        }

        const checker = board[row][col];

        if (selectedChecker) {
            const rowDiff = Math.abs(selectedChecker.row - row);
            const colDiff = Math.abs(selectedChecker.col - col);

            const isCapture =
                rowDiff === 2 && colDiff === 2 && isOpponentChecker(selectedChecker, row, col);

            const isRegularMove =
                rowDiff === 1 &&
                colDiff === 1 &&
                board[row][col] === null &&
                isMovingForward(selectedChecker, row);

            if ((isRegularMove || isCapture) && board[row][col] === null) {
                moveChecker(row, col, isCapture);
            } else {
                console.log("[DEBUG] Invalid move.");
                setSelectedChecker(null);
            }
        } else if (checker && checker.player === "P2" && isPlayerTurn) {
            console.log("[DEBUG] Selecting checker:", checker);
            setSelectedChecker({ ...checker, row, col });
        }
    };

    const isOpponentChecker = (checker, targetRow, targetCol) => {
        const midRow = (checker.row + targetRow) / 2;
        const midCol = (checker.col + targetCol) / 2;
        const midSquare = board[midRow][midCol];

        return midSquare && midSquare.player === "P1"; // Opponent is "P1"
    };

    const isMovingForward = (checker, targetRow) => {
        return (
            (checker.player === "P1" && targetRow > checker.row) || // P1 moves down
            (checker.player === "P2" && targetRow < checker.row) || // P2 moves up
            checker.isKing // Kings can move in any direction
        );
    };

    const moveChecker = (row, col, isCapture) => {
        const newBoard = board.map((r, rowIndex) =>
            r.map((square, colIndex) => {
                if (
                    rowIndex === selectedChecker.row &&
                    colIndex === selectedChecker.col
                ) {
                    return null; // Clear the original position
                }
                if (rowIndex === row && colIndex === col) {
                    // Mark as king if the checker reaches the opponent's end
                    const isKing =
                        (selectedChecker.player === "P1" && row === 7) ||
                        (selectedChecker.player === "P2" && row === 0);
                    selectedChecker.isKing = selectedChecker.isKing || isKing; // Retain king status or promote
                    return { ...selectedChecker, isKing: selectedChecker.isKing };
                }
                return square;  
            })
        );

        // Remove the captured checker
        if (isCapture) {
            const midRow = (selectedChecker.row + row) / 2;
            const midCol = (selectedChecker.col + col) / 2;
            newBoard[midRow][midCol] = null; // Remove the opponent's checker
        }

        console.log("[DEBUG] Board state after move:", newBoard); // Log the board state

        setBoard(newBoard);

        const move = {
            fromRow: selectedChecker.row,
            fromCol: selectedChecker.col,
            toRow: row,
            toCol: col,
            isKing: selectedChecker.isKing,
            isCapture,
        };

        console.log("[DEBUG] Sending move:", move);

        connection.invoke("SendMove", roomId, move).catch((err) => {
            console.error("[DEBUG] Error sending move:", err);
        });

        setSelectedChecker(null);

        // Allow chain captures: Check if additional captures are possible
        if (isCapture && canCapture(row, col)) {
            setSelectedChecker({ ...selectedChecker, row, col });
        } else {
            setIsPlayerTurn(false); // Switch turn
        }
    };


    const canCapture = (row, col) => {
        const directions = [
            [-2, -2],
            [-2, 2],
            [2, -2],
            [2, 2],
        ];

        return directions.some(([dRow, dCol]) => {
            const targetRow = row + dRow;
            const targetCol = col + dCol;

            if (
                targetRow >= 0 &&
                targetRow < 8 &&
                targetCol >= 0 &&
                targetCol < 8 &&
                board[targetRow][targetCol] === null // Target square must be empty
            ) {
                const midRow = (row + targetRow) / 2;
                const midCol = (col + targetCol) / 2;
                const midSquare = board[midRow][midCol];

                return midSquare && midSquare.player === "P1"; // Opponent is "P1"
            }

            return false;
        });
    };

    const checkGameOver = (currentBoard, currentPlayer) => {
        const player1Checkers = [];
        const player2Checkers = [];

        // Traverse the board and count Player 1 and Player 2 checkers
        board.forEach((row, rowIndex) => {
            row.forEach((square, colIndex) => {
                if (square && square.player === "P1") {
                    player1Checkers.push({ row: rowIndex, col: colIndex, isKing: square.isKing });
                }
                if (square && square.player === "P2") {
                    player2Checkers.push({ row: rowIndex, col: colIndex, isKing: square.isKing });
                }
            });
        });

        console.log("[DEBUG] Player 1 Checkers:", player1Checkers.length);
        console.log("[DEBUG] Player 2 Checkers:", player2Checkers.length);


        // Check if a player has no valid moves
        const canPlayer1Move = player1Checkers.some((checker) =>
            canCheckerMove(checker.row, checker.col, "P1")
        );
        const canPlayer2Move = player2Checkers.some((checker) =>
            canCheckerMove(checker.row, checker.col, "P2")
        );

        // Determine if a player has no remaining checkers
        if (player1Checkers.length === 0) {
            setGameOverMessage(`You won! ${opponent} has no remaining checkers.`);
            return true;
        } else if (!canPlayer1Move) {
            setGameOverMessage(`You won! ${opponent} has no valid moves.`);
        } else if (player2Checkers.length === 0) {
            setGameOverMessage(`${opponent} wins! You have no remaining checkers.`);
            return true;
        } else if (!canPlayer1Move) {
            setGameOverMessage(`${opponent} wins! You have no valid moves.`);
        }

        return false;
    };

    useEffect(() => {
        if (checkGameOver()) {
            console.log("[DEBUG] Game Over detected!");
            return;
        }
    }, [board]); // Runs every time the board changes

    const canCheckerMove = (row, col, player) => {
        const directions = player === "P1" || board[row][col].isKing
            ? [[1, -1], [1, 1]] // Player 1 moves downward, Kings can move in both directions
            : [];
        const kingDirections = player === "P2" || board[row][col].isKing
            ? [[-1, -1], [-1, 1]] // Player 2 moves upward, Kings can move in both directions
            : [];

        const allDirections = [...directions, ...kingDirections];

        return allDirections.some(([dRow, dCol]) => {
            const newRow = row + dRow;
            const newCol = col + dCol;

            // Check if within bounds and if the target square is empty
            if (
                newRow >= 0 &&
                newRow < 8 &&
                newCol >= 0 &&
                newCol < 8 &&
                board[newRow][newCol] === null
            ) {
                return true;
            }

            // Check for capture move
            const captureRow = row + 2 * dRow;
            const captureCol = col + 2 * dCol;
            const middleRow = row + dRow;
            const middleCol = col + dCol;

            return (
                captureRow >= 0 &&
                captureRow < 8 &&
                captureCol >= 0 &&
                captureCol < 8 &&
                board[captureRow][captureCol] === null &&
                board[middleRow][middleCol]?.player !== player &&
                board[middleRow][middleCol] // There must be an opponent piece to capture
            );
        });
    };

    const resetGame = () => {
        setBoard(initializeBoard()); // Reset the board to the initial state
        setSelectedChecker(null); // Clear any selected checker
        setIsPlayerTurn(true); // Reset turn to Player 1 (or whichever starts)
        setGameOverMessage(""); // Clear the game-over message
    };

    return (
        <GameWrapper>
            <OpponentWrapper>
                <NicknameDisplay isOpponent={true}>
                    {opponent ? `Opponent: ${opponent}` : "Waiting for opponent..."}
                </NicknameDisplay>
            </OpponentWrapper>
            <BoardWrapper isPlayerTurn={isPlayerTurn}>
                <Board
                    board={board}
                    onMove={handleSquareClick}
                    selectedChecker={selectedChecker}
                />
            </BoardWrapper>
            <NicknameDisplay>{nickname}</NicknameDisplay>
            {/* Game-Over Overlay */}
            <GameOverOverlay visible={gameOverMessage !== ""}>
                <GameOverMessageBox>
                    <div>{gameOverMessage}</div>
                    <div>
                        {/* Redirects to the default URL */}
                        <GameOverButton onClick={() => navigate("/")}>Menu</GameOverButton>
                    </div>
                </GameOverMessageBox>
            </GameOverOverlay>
        </GameWrapper>
    );
};

export default Game;
