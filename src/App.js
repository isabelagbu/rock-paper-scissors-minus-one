import React, { useEffect } from "react";
import "./index.css";

function App() {

  const handleOptionClick = (option) => {
    if (option === "How To") {
      // Open the YouTube link in a new tab
      window.open("https://youtu.be/Q4auMJndpuI?si=5eJ_QX7oILRSdV-E", "_blank");
    } else {
      console.log(`${option} clicked!`); // Replace with navigation or functionality
    }
  };
  return (
    <div className="App">
      <h1>Squid Game - Rock Paper Scissors Minus One</h1>
      <div className="button-container">
        <button onClick={() => handleOptionClick("Single Player")}>
          Single Player
        </button>
        <button onClick={() => handleOptionClick("Multiplayer")}>
          Multiplayer
        </button>
        <button onClick={() => handleOptionClick("Leaderboard")}>
          Leaderboard
        </button>
        <button onClick={() => handleOptionClick("How To")}>How To</button>
      </div>
    </div>
  );
}

export default App;