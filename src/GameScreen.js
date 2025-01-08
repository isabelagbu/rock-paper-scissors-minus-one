import React, { useEffect, useState } from "react";
import "./index.css";

function Countdown({ countdown }) {
  return countdown ? <div className="countdown">{countdown}</div> : null;
}

function GameUI({ animateHands, leftHandImage, rightHandImage, aiLeftHandImage, aiRightHandImage }) {
  return (
    <div className="game-ui">
      <div className={`left-container ${animateHands ? "hand-move-left" : ""}`}>
        <img src={leftHandImage} alt="Left Hand" className="game-image" />
        <img src={rightHandImage} alt="Right Hand" className="game-image" />
      </div>
      <div className={`right-container ${animateHands ? "hand-move-right" : ""}`}>
        <img src={aiLeftHandImage} alt="Right Hand" className="game-image" />
        <img src={aiRightHandImage}  alt="Left Hand" className="game-image" />
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
  const [playMusic, setPlayMusic] = useState(true);
  const [playRound, setPlayRound] = useState(false);
  const [animateHands, setAnimateHands] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [leftHandImage, setLeftHandImage] = useState("/hands/left_lefthand_rock.png");
  const [rightHandImage, setRightHandImage] = useState("/hands/left_righthand_rock.png");
  const [aiLeftHandImage, setAILeftHandImage] = useState("/hands/right_lefthand_rock.png");
  const [aiRightHandImage, setAIRightHandImage] = useState("/hands/right_righthand_rock.png");
  const [selectedLeftHand, setSelectedLeftHand] = useState(null);
  const [selectedRightHand, setSelectedRightHand] = useState(null);
  const [aiSelectedLeftHand, setAISelectedLeftHand] = useState(null);
  const [aiSelectedRightHand, setAISelectedRightHand] = useState(null);
  const [playerDone, setPlayerDone] = useState(false); 

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

  const aiLeftHandImages = {
    Q: "/hands/right_lefthand_rock.png",
    W: "/hands/right_lefthand_paper.png",
    E: "/hands/right_lefthand_scissors.png",
  };

  const aiRightHandImages = {
    A: "/hands/right_righthand_rock.png",
    S: "/hands/right_lefthand_paper.png",
    D: "/hands/right_lefthand_scissors.png",
  };

  // AI Logic: Randomly choose from valid keys for each hand
  const generateAiChoice = (choices) => {
    return choices[Math.floor(Math.random() * choices.length)];
  };

  useEffect(() => {
    const robotCountDownSound = new Audio("/robot.mp3");
    const gameMusic = new Audio("/squid_game.mp3");
    robotCountDownSound.play();
    robotCountDownSound.addEventListener("ended", () => {
      gameMusic.play();
      setPlayRound(true);
    });
  }, [playMusic]);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 1) {
          return prev - 1;
        } else if (prev === 1) {
          return "Go!";
        } else {
          clearInterval(countdownInterval);
          setCountdown(null);
          setPlayRound(true);

          if (playRound) {
            setAnimateHands(true);
            setShowTimer(true);

            let userDone = false;
            // Player Choices
            setLeftHandImage(playerLeftHandImages[selectedLeftHand] || "/hands/left_lefthand_rock.png");
            setRightHandImage(playerRightHandImages[selectedRightHand] || "/hands/left_righthand_rock.png");
            userDone = true;

            

            // Generate AI Choices
            const aiLeftKey = generateAiChoice(["Q", "W", "E"]);
            const aiRightKey = generateAiChoice(["A", "S", "D"]);

            setAISelectedLeftHand(aiLeftKey);
            setAISelectedRightHand(aiRightKey);

            if(userDone) {
               // Update AI Hand Images
            setAILeftHandImage(aiLeftHandImages[aiLeftKey]);
            setAIRightHandImage(aiRightHandImages[aiRightKey]);
            }

            
           

            setTimeout(() => {
              setShowTimer(false); // Hide timer after 4 seconds
            }, 4000);
            return prev;
          }
          setPlayRound(false);
        }
      });
    }, 1000);
    return () => clearInterval(countdownInterval);
  }, [selectedLeftHand, selectedRightHand, playRound]);

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
      <GameUI
        animateHands={animateHands}
        leftHandImage={leftHandImage}
        rightHandImage={rightHandImage}
        aiLeftHandImage={aiLeftHandImage}
        aiRightHandImage={aiRightHandImage}
      />
      <Controls selectedLeftHand={selectedLeftHand} selectedRightHand={selectedRightHand} />
      {showTimer && <div className="make-choice-text">Make Your Choice</div>}
      <TimerBar showTimer={showTimer} />
    </div>
  );
}

export default GameScreen;