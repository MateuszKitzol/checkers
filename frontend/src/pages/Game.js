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
        connection.on("ReceiveMove", (move, playerId) => {
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
                : move; // Use the move directly for the current player

            setBoard((prevBoard) => {
                const newBoard = prevBoard.map((row) => [...row]);

                // Update the board based on the adjusted move
                newBoard[adjustedMove.fromRow][adjustedMove.fromCol] = null;
                newBoard[adjustedMove.toRow][adjustedMove.toCol] = {
                    player: isOpponentMove ? "P1" : "P2", // Assign based on who made the move
                    isKing: adjustedMove.isKing,
                };

                return newBoard;
            });

            console.log("[DEBUG] Move applied as", isOpponentMove ? "opponent's move" : "player's own move");
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
            const isDiagonalMove =
                Math.abs(selectedChecker.row - row) === 1 &&
                Math.abs(selectedChecker.col - col) === 1;

            const isMovingForward =
                (selectedChecker.player === "P1" && row > selectedChecker.row) ||
                (selectedChecker.player === "P2" && row < selectedChecker.row) ||
                selectedChecker.isKing;

            if (isDiagonalMove && isMovingForward && board[row][col] === null) {
                moveChecker(row, col);
            } else {
                console.log("[DEBUG] Invalid move.");
                setSelectedChecker(null);
            }
        } else if (checker && checker.player === "P2" && isPlayerTurn) {
            console.log("[DEBUG] Selecting checker:", checker);
            setSelectedChecker({ ...checker, row, col });
        }
    };

    const moveChecker = (row, col) => {
        const newBoard = board.map((r, rowIndex) =>
            r.map((square, colIndex) => {
                if (
                    rowIndex === selectedChecker.row &&
                    colIndex === selectedChecker.col
                ) {
                    return null;
                }
                if (rowIndex === row && colIndex === col) {
                    return selectedChecker;
                }
                return square;
            })
        );

        setBoard(newBoard);

        const move = {
            fromRow: selectedChecker.row,
            fromCol: selectedChecker.col,
            toRow: row,
            toCol: col,
            isKing: selectedChecker.isKing,
        };

        console.log("[DEBUG] Sending move:", move);

        connection.invoke("SendMove", roomId, move).catch((err) => {
            console.error("[DEBUG] Error sending move:", err);
        });

        setSelectedChecker(null);
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
        </GameWrapper>
    );
};

export default Game;
