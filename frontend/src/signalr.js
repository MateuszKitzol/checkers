import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7116/gameHub") // Replace with the correct backend URL
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

export default connection;
