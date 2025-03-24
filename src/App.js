import React, { useState } from "react";
import "./index.css";
import GameScreen from "./GameScreen";

function MenuScreen() {
  const [animate, setAnimate] = useState(false); // For title and button animations
  const [gameStarted, setGameStarted] = useState(false); // To toggle game screen

  const handleOptionClick = (option) => {
    console.log(`${option} clicked!`);
    setAnimate(true); // Trigger animations

    if (option === "How To") {
      // Open the YouTube link in a new tab
      window.open("https://youtu.be/Q4auMJndpuI?si=5eJ_QX7oILRSdV-E", "_blank");
    } else {
      // Start game after animation
      setTimeout(() => {
        setGameStarted(true); // Transition to game screen
      }, 1000); // Match animation duration
    }
  };

  return (
    <div className="App">
      {!gameStarted ? (
        <>
          <h1 className={`title ${animate ? "fly-up" : ""}`}>
            Rock Paper Scissors Minus One
          </h1>
          <div className={`button-container ${animate ? "fly-down" : ""}`}>
            <button onClick={() => handleOptionClick("Single Player")}>
              Single Player
            </button>
            <button onClick={() => handleOptionClick("Multiplayer")} disabled>
              Multiplayer
            </button>
            <button onClick={() => handleOptionClick("LeaderBoard")} disabled>
              LeaderBoard
            </button>
            <button onClick={() => handleOptionClick("How To")}>
              How To
            </button>
          </div>
        </>
      ) : (
        <GameScreen />
      )}
    </div>
  );
}

export default MenuScreen;