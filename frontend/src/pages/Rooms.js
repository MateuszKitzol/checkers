import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const RoomsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #121212;
    color: #e4e4e4;
`;

const Title = styled.h1`
    font-size: 2.5rem;
    margin-bottom: 20px;
`;

const RoomList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0 0 30px 0; /* Dodano większy dolny margines */
    width: 100%;
    max-width: 400px;
`;

const RoomItem = styled.li`
    padding: 10px 20px;
    margin: 10px 0;
    background-color: ${(props) =>
        props.status === "free"
            ? "#1f78d1"
            : props.status === "waiting"
                ? "#f1c40f"
                : "#d9534f"};
    color: white;
    border-radius: 5px;
    text-align: center;
    cursor: ${(props) => (props.status === "occupied" ? "not-allowed" : "pointer")};
    transition: background-color 0.3s;

    &:hover {
        background-color: ${(props) =>
        props.status === "occupied"
            ? "#d9534f"
            : props.status === "free"
                ? "#155a99"
                : "#d4ac0d"};
        color: white;
    }
`;

const ButtonBase = styled.button`
    margin-top: 10px; /* Zmniejszona odległość */
    padding: 10px 20px;
    width: 200px;
    text-align: center;
    background-color: #1f78d1;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 18px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #155a99;
    }

    &:disabled {
        background-color: #888;
        cursor: not-allowed;
    }
`;

const NewRoomButton = styled(ButtonBase)``;

const BackButton = styled(ButtonBase)``;

const Rooms = () => {
    const [rooms, setRooms] = useState([
        { id: 0, name: "Room 1", status: "free" },
        { id: 1, name: "Room 2", status: "waiting" },
        { id: 2, name: "Room 3", status: "occupied" },
    ]);

    const navigate = useNavigate();

    const createNewRoom = () => {
        const newRoomId = rooms.length;
        const newRoom = { id: newRoomId, name: `Room ${newRoomId + 1}`, status: "free" };
        setRooms([...rooms, newRoom]);
    };

    const getFreeRoomCount = () => {
        return rooms.filter((room) => room.status === "free").length;
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case "free":
                return "Free - No players";
            case "waiting":
                return "Waiting for second player";
            case "occupied":
                return "Occupied - Game in progress";
            default:
                return "";
        }
    };

    return (
        <RoomsWrapper>
            <Title>Available Rooms</Title>
            <RoomList>
                {rooms.map((room) => (
                    <RoomItem key={room.id} status={room.status}>
                        {room.status !== "occupied" ? (
                            <a href={`/game/${room.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                                {room.name} - {getStatusLabel(room.status)}
                            </a>
                        ) : (
                            `${room.name} - ${getStatusLabel(room.status)}`
                        )}
                    </RoomItem>
                ))}
            </RoomList>
            <NewRoomButton
                onClick={createNewRoom}
                disabled={getFreeRoomCount() >= 3}
            >
                {getFreeRoomCount() >= 3 ? "Limit Reached" : "Create New Room"}
            </NewRoomButton>
            <BackButton onClick={() => navigate("/")}>Back to Home</BackButton>
        </RoomsWrapper>
    );
};

export default Rooms;
