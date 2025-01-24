import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Nickname from "./pages/Nickname";
import Rooms from "./pages/Rooms";
import Game from "./pages/Game";
import Header from "./components/Header";
import GlobalStyle from "./GlobalStyle";
import connection from "./signalr";

const App = () => {
    useEffect(() => {
        console.log("App.js")

        // Start the SignalR connection if not already connected
        if (connection.state === "Disconnected") {
            connection.start()
                .then(() => console.log("Connected to SignalR Hub1"))
                .catch((err) => console.error("SignalR Connection Error:", err));
        }

        return () => {
            // Stop the connection when the app unmounts
            if (connection.state === "Connected") {
                connection.stop()
                    .then(() => console.log("Disconnected from SignalR Hub"))
                    .catch((err) => console.error("Error stopping SignalR connection:", err));
            }
        };
    }, []); // Run once on app load

    return (
        <Router>
            <GlobalStyle />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/nickname" element={<Nickname />} />
                <Route path="/rooms" element={<Rooms />} />
                <Route path="/game/:roomId" element={<Game />} />
            </Routes>
        </Router>
    );
};

export default App;