import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Nickname from "./pages/Nickname";
import Rooms from "./pages/Rooms";
import Game from "./pages/Game";
import Header from "./components/Header";
import GlobalStyle from "./GlobalStyle";

const App = () => {
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