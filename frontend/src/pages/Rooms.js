import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import connection from "../signalr";

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
    margin: 0 0 30px 0;
    width: 100%;
    max-width: 400px;
`;

const RoomItem = styled.li`
    padding: 10px 20px;
    margin: 10px 0;
    background-color: ${(props) =>
        props.status === "free"
            ? "#28a745"
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
        props.status === "free"
            ? "#218838"
            : props.status === "waiting"
                ? "#d4ac0d"
                : "#b52b27"};
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

const ButtonBase = styled.button`
    margin-top: 10px;
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
    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate();

    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        if (connection) {
            // Listen for updates to the room list
            connection.on("UpdateRooms", (updatedRooms) => {
                console.log("Rooms updated:", updatedRooms);
                setRooms(updatedRooms);
            });

            // Fetch the initial list of rooms
            connection.invoke("GetRooms").catch((err) => {
                console.error("Error fetching rooms:", err);
            });

            // Cleanup: Remove event listener on unmount
            return () => {
                connection.off("UpdateRooms");
            };
        }
    }, []);

    const createRoom = () => {
        const roomName = `Room ${rooms.length + 1}`;
        connection.invoke("CreateRoom", roomName).catch((err) => {
            console.error("Error creating room:", err);
        });
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
                            <a href={`/game/${room.id}`}>
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
