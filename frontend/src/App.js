import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Rooms from "./pages/Rooms"; // Import nowej strony
import Header from "./components/Header";
import GlobalStyle from "./GlobalStyle";

const App = () => {
    return (
        <Router>
            <GlobalStyle />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/rooms" element={<Rooms />} />
                <Route path="/game/:roomId" element={<Game />} />
            </Routes>
        </Router>
    );
};

export default App;


