import React from "react";

const Square = ({ value, onClick }) => {
    const backgroundColor = value === "P1" ? "red" : value === "P2" ? "blue" : "white";

    return (
        <button
            onClick={onClick}
            style={{
                width: "50px",
                height: "50px",
                backgroundColor,
                border: "1px solid black",
            }}
        >
            {value}
        </button>
    );
};

export default Square;