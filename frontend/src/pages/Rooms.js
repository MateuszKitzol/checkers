import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

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
    margin: 0;
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
                ? "#d9534f" /* Utrzymanie koloru tła dla zajętych pokoi */
                : props.status === "free"
                ? "#155a99"
                : "#d4ac0d"};
        color: white;
    }

    a {
        color: white;
        text-decoration: none;
        font-weight: bold;
        pointer-events: ${(props) => (props.status === "occupied" ? "none" : "auto")};

        &:hover {
            color: white;
        }
    }
`;




const NewRoomButton = styled.button`
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #1f78d1;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 18px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #155a99;
        color: white; /* Utrzymanie koloru tekstu */
    }

    &:disabled {
        background-color: #888;
        cursor: not-allowed;
    }
`;

const BackLink = styled(Link)`
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #1f78d1;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    font-size: 18px;
    transition: background-color 0.3s;

    &:hover {
        background-color: #155a99;
        color: white; /* Utrzymanie koloru tekstu */
    }
`;

const Rooms = () => {
    const [rooms, setRooms] = useState([
        { id: 0, name: "Room 1", status: "free" },
        { id: 1, name: "Room 2", status: "waiting" },
        { id: 2, name: "Room 3", status: "occupied" },
    ]);

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
                            <Link to={`/game/${room.id}`}>
                                {room.name} - {getStatusLabel(room.status)}
                            </Link>
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
            <BackLink to="/">Back to Home</BackLink>
        </RoomsWrapper>
    );
};

export default Rooms;
