import React, { useEffect, useState } from "react";
import "./index.css"; // Ensure this file contains styles for GameScreen

function GameScreen() {
  const [countdown, setCountdown] = useState(3); // Start the countdown from 3
  const [animateHands, setAnimateHands] = useState(false); // Toggle hand movement
  const [showTimer, setShowTimer] = useState(false); // Toggle timer visibility

  useEffect(() => {
    const gameSound1 = new Audio("/robot.mp3"); // First sound
    const gameSound2 = new Audio("/squid_game.mp3"); // Second sound
    const beepSound = new Audio("/beeps.mp3"); // Beep sound for the countdown

    // Play the first sound
    gameSound1.play();

    // Set up an event listener to play the second sound after the first ends
    gameSound1.addEventListener("ended", () => {
      gameSound2.play();
    });

    // Countdown logic with beeps
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 1) {
          beepSound.play(); // Play beep for each number
          return prev - 1;
        } else if (prev === 1) {
          beepSound.play(); // Play beep for "Go!"
          return "Go!";
        } else {
          clearInterval(countdownInterval); // Clear the interval
          setTimeout(() => {
            setCountdown(null); // Remove countdown after "Go!" is displayed
            setAnimateHands(true); // Start hand animations
            setTimeout(() => {
              setShowTimer(true); // Show timer after animation
              // Automatically hide timer after 5 seconds
              setTimeout(() => setShowTimer(false), 5000);
            }, 2000);
          }, 500);
          return prev;
        }
      });
    }, 1000);

    return () => {
      // Clean up event listeners and interval
      gameSound1.removeEventListener("ended", () => {
        gameSound2.play();
      });
      clearInterval(countdownInterval);
    };
  }, []);

  return (
    <div className="game-screen">
      {/* Countdown Display */}
      {countdown && <div className="countdown">{countdown}</div>}

      {/* Game UI */}
      <div className={`left-container ${animateHands ? "hand-move-left" : ""}`}>
        <img src="/hands/left_lefthand_rock.png" alt="Rock" className="game-image" />
        <img src="/hands/left_righthand_rock.png" alt="Rock" className="game-image" />
      </div>
      <div className={`right-container ${animateHands ? "hand-move-right" : ""}`}>
        <img src="/hands/right_righthand_rock.png" alt="Rock" className="game-image" />
        <img src="/hands/right_lefthand_rock.png" alt="Rock" className="game-image" />
      </div>

      {/* Left-side controls */}
      <div className="tile-container left-controls">
        <div className="tile">
          <p>A</p>
          <span>Rock</span>
        </div>
        <div className="tile">
          <p>S</p>
          <span>Paper</span>
        </div>
        <div className="tile">
          <p>D</p>
          <span>Scissors</span>
        </div>
      </div>

      {/* Right-side controls */}
      <div className="tile-container right-controls">
        <div className="tile">
          <p>J</p>
          <span>Rock</span>
        </div>
        <div className="tile">
          <p>K</p>
          <span>Paper</span>
        </div>
        <div className="tile">
          <p>L</p>
          <span>Scissors</span>
        </div>
      </div>

      {/* Display 'Make Your Choice' During Timer */}
      {showTimer && <div className="make-choice-text">Make Your Choice</div>}

      {/* Timer Bar */}
      <div className="timer-bar-container">
        <div className={`timer-bar ${showTimer ? "visible" : ""}`}></div>
      </div>
    </div>
  );
}

export default GameScreen;