import React, { useEffect } from "react";
import "./Game.css";

function Game() {
  useEffect(() => {
    const gameSound = new Audio("/robot.mp3");
    gameSound.play();
  }, []);

  return (
    <div className="game-screen">
      <img
        src="/rock.png"
        alt="Rock"
        className="game-image rock"
      />
      <img
        src="/paper.png"
        alt="Paper"
        className="game-image paper"
      />
    </div>
  );
}

export default Game;