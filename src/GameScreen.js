import React, { useEffect, useState } from "react";
import "./index.css";

function Countdown({ countdown }) {
  return countdown ? <div className="countdown">{countdown}</div> : null;
}

function GameUI({ animateHands, leftHandImage, rightHandImage }) {
  return (
    <div className="game-ui">
      <div className={`left-container ${animateHands ? "hand-move-left" : ""}`}>
        <img src={leftHandImage} alt="Left Hand" className="game-image" />
        <img src={rightHandImage} alt="Right Hand" className="game-image" />
      </div>
      <div className={`right-container ${animateHands ? "hand-move-right" : ""}`}>
        <img src="/hands/right_righthand_rock.png" alt="Right Hand" className="game-image" />
        <img src="/hands/right_lefthand_rock.png" alt="Left Hand" className="game-image" />
      </div>
    </div>
  );
}

function Controls({ selectedLeftHand, selectedRightHand }) {
  return (
    <div className="controls">
      <div className="tile-container top-left-controls">
        <div className={`tile ${selectedLeftHand === "Q" ? "active" : ""}`}>
          <p>Q</p>
          <span>Rock</span>
        </div>
        <div className={`tile ${selectedLeftHand === "W" ? "active" : ""}`}>
          <p>W</p>
          <span>Paper</span>
        </div>
        <div className={`tile ${selectedLeftHand === "E" ? "active" : ""}`}>
          <p>E</p>
          <span>Scissors</span>
        </div>
      </div>
      <div className="tile-container bottom-left-controls">
        <div className={`tile ${selectedRightHand === "A" ? "active" : ""}`}>
          <p>A</p>
          <span>Rock</span>
        </div>
        <div className={`tile ${selectedRightHand === "S" ? "active" : ""}`}>
          <p>S</p>
          <span>Paper</span>
        </div>
        <div className={`tile ${selectedRightHand === "D" ? "active" : ""}`}>
          <p>D</p>
          <span>Scissors</span>
        </div>
      </div>
    </div>
  );
}

function TimerBar({ showTimer }) {
  return (
    <div className="timer-bar-container">
      <div className={`timer-bar ${showTimer ? "visible" : ""}`}></div>
    </div>
  );
}

function GameScreen() {
  const [countdown, setCountdown] = useState(3);
  const [animateHands, setAnimateHands] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [leftHandImage, setLeftHandImage] = useState("/hands/left_lefthand_rock.png");
  const [rightHandImage, setRightHandImage] = useState("/hands/left_righthand_rock.png");
  const [selectedLeftHand, setSelectedLeftHand] = useState(null);
  const [selectedRightHand, setSelectedRightHand] = useState(null);

  const playerLeftHandImages = {
    Q: "/hands/left_lefthand_rock.png",
    W: "/hands/left_righthand_paper.png",
    E: "/hands/left_righthand_scissors.png",
  };
  const playerRightHandImages = {
    A: "/hands/left_righthand_rock.png",
    S: "/hands/left_righthand_paper.png",
    D: "/hands/left_righthand_scissors.png",
  };

  useEffect(() => {
    const gameSound1 = new Audio("/robot.mp3");
    const gameSound2 = new Audio("/squid_game.mp3");
    const beepSound = new Audio("/beeps.mp3");

    gameSound1.play();

    gameSound1.addEventListener("ended", () => {
      gameSound2.play();
    });

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 1) {
          beepSound.currentTime = 0;
          beepSound.play();
          return prev - 1;
        } else if (prev === 1) {
          beepSound.currentTime = 0;
          beepSound.play();
          return "Go!";
        } else {
          clearInterval(countdownInterval);
          setCountdown(null);
          setAnimateHands(true);
          setShowTimer(true);

          // Immediately update images when the timer ends
          setLeftHandImage(playerLeftHandImages[selectedLeftHand] || "/hands/left_lefthand_rock.png");
          setRightHandImage(playerRightHandImages[selectedRightHand] || "/hands/left_righthand_rock.png");

          setTimeout(() => {
            setShowTimer(false); // Hide timer after 4 seconds
          }, 4000);

          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [selectedLeftHand, selectedRightHand]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key.toUpperCase();

      if (showTimer) {
        if (["Q", "W", "E"].includes(key)) {
          setSelectedLeftHand(key);
        } else if (["A", "S", "D"].includes(key)) {
          setSelectedRightHand(key);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [showTimer]);

  return (
    <div className="game-screen">
      <Countdown countdown={countdown} />
      <GameUI animateHands={animateHands} leftHandImage={leftHandImage} rightHandImage={rightHandImage} />
      <Controls selectedLeftHand={selectedLeftHand} selectedRightHand={selectedRightHand} />
      {showTimer && <div className="make-choice-text">Make Your Choice</div>}
      <TimerBar showTimer={showTimer} />
    </div>
  );
}

export default GameScreen;