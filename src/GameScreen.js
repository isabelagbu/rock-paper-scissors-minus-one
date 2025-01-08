import React, { useEffect, useState, useRef } from "react";
import "./index.css";

function Scoreboard({ playerScore, aiScore }) {
  return (
    <>
      <div className="player-score">
        <h2>Player</h2>
        <p>{playerScore}</p>
      </div>
      <div className="ai-score">
        <h2>AI</h2>
        <p>{aiScore}</p>
      </div>
    </>
  );
}

function Countdown({ countdown }) {
  return countdown ? <div className="countdown">{countdown}</div> : null;
}

function GameUI({ animateHands, leftHandImage, rightHandImage, aiLeftHandImage, aiRightHandImage, handToRemove, aiHandToRemove }) {
  return (
    <div className="game-ui">
      <div className={`left-container ${animateHands ? "hand-move-left" : ""}`}>
        <img
          src={leftHandImage}
          alt="Left Hand"
          className={`game-image ${handToRemove === "Q" ? "animate-left hand-image" : ""}`}
        />
        <img
          src={rightHandImage}
          alt="Right Hand"
          className={`game-image ${handToRemove === "A" ? "animate-left hand-image" : ""}`}
        />
      </div>
      <div className={`right-container ${animateHands ? "hand-move-right" : ""}`}>
        <img src={aiRightHandImage} alt="Right Hand" className={`game-image ${aiHandToRemove === "Q" ? "animate-right hand-image" : ""}`} />
        <img src={aiLeftHandImage} alt="Left Hand" className={`game-image ${aiHandToRemove === "A" ? "animate-right hand-image" : ""}`} />
      </div>
    </div>
  );
}

function Controls({ selectedLeftHand, selectedRightHand, executeMinusOne, handToRemove }) {
  console.log("hand to remove: " + handToRemove)
  return (
    <div className="controls">
      {executeMinusOne ? (
        <>
          <div className="tile-container top-left-controls">
            <div className={`tile ${handToRemove === "Q" ? "active" : ""}`}>
              <p>Q</p>
              <span>Remove Left</span>
            </div>
          </div>
          <div className="tile-container bottom-left-controls">
            <div className={`tile ${handToRemove === "A" ? "active" : ""}`}>
              <p>A</p>
              <span>Remove Right</span>
            </div>
          </div>
        </>
      ) : (
        <>
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
        </>
      )}
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
  const aiPlayed = useRef(false); // Ref to track if AI has played
  const [screenText, setScreenText] = useState("Make Your Choice");
  const [executeMinusOne, setExecuteMinusOne] = useState(false);
  const [executeAIMinusOne, setExecuteAIMinusOne] = useState(false);
  const [aiHandToRemove, setAIHandToRemove] = useState(null);
  const [handToRemove, setHandToRemove] = useState(null);
  const [rockPaperScissorsHappening, setRockPaperScissorsHappening] = useState(true);
  const [playerScore, setPlayerScore] = useState(0); // Player score state
  const [aiScore, setAIScore] = useState(0); // AI score st

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
    if (playRound) {
      return choices[Math.floor(Math.random() * choices.length)];
    }
  };

  const playMusic = () => {
    const robotCountDownSound = new Audio("/robot.mp3");
    const gameMusic = new Audio("/squid_game.mp3");
    robotCountDownSound.play();
    robotCountDownSound.addEventListener("ended", () => {
      gameMusic.play();
    });
  }

  useEffect(() => {
    playMusic();
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 1) return prev - 1;
        else if (prev === 1) return "Go!";
        else {
          clearInterval(countdownInterval);
          setCountdown(null);
          setPlayRound(true);
          playARound();
        }
      });
    }, 1000);
    return () => clearInterval(countdownInterval);
  }, []);

  const playARound = () => {
    setAnimateHands(true);
    setShowTimer(true);

    setLeftHandImage(playerLeftHandImages[selectedLeftHand] || "/hands/left_lefthand_rock.png");
    setRightHandImage(playerRightHandImages[selectedRightHand] || "/hands/left_righthand_rock.png");
  }

  //HANDLING THE ROCK PAPER SCISSORS PLAYS
  useEffect(() => {
    //PLAYER PLAY
    if (playRound) {
      playARound();
    }

    //AI PLAY
    if (playRound && !aiPlayed.current) {
      aiPlayed.current = true; // Ensure AI logic runs only once per round

      // Generate AI Choices
      const aiLeftKey = generateAiChoice(["Q", "W", "E"]);
      const aiRightKey = generateAiChoice(["A", "S", "D"]);

      setTimeout(() => {
        setAILeftHandImage(aiLeftHandImages[aiLeftKey]);
        setAIRightHandImage(aiRightHandImages[aiRightKey]);
      }, 3000);

      setTimeout(() => {
        setShowTimer(false); // Hide timer after 4 seconds
        aiPlayed.current = false; // Reset for the next round
        setExecuteMinusOne(true);
      }, 4000);
    }
  }, [playRound, selectedLeftHand, selectedRightHand]);
  

  //HANDLING MINUS ONE (REMOVING A HAND)
  useEffect(() => {
    if (executeMinusOne) {
    setScreenText("Minus One");
    setShowTimer(true); // Show the timer immediately

      const handleKeyPress = (event) => {
        const key = event.key.toUpperCase();
        if (executeMinusOne) {
          if (["Q", "A"].includes(key)) {
            setHandToRemove(key); // Update the hand to remove
            setExecuteAIMinusOne(true); // Trigger AI Minus One after user input
          }
        }
      };
  
      window.addEventListener("keydown", handleKeyPress);
  
      return () => {
        setShowTimer(false);
        window.removeEventListener("keydown", handleKeyPress);
      };
    }
  }, [executeMinusOne, showTimer]);


  useEffect(() => {
    if (executeAIMinusOne) {
      const aiHandToRemoveChoice = generateAiChoice(["Q", "A"]);
      setAIHandToRemove(aiHandToRemoveChoice); 
      setScreenText(""); 
      setExecuteAIMinusOne(false);
    }
  }, [executeAIMinusOne]);

  useEffect(() => {
      const handleKeyPress = (event) => {
        const key = event.key.toUpperCase();
        if (showTimer && executeMinusOne === false) {
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
            <Scoreboard playerScore={playerScore} aiScore={aiScore} />
      <Countdown countdown={countdown} />
      <GameUI
        animateHands={animateHands}
        leftHandImage={leftHandImage}
        rightHandImage={rightHandImage}
        aiLeftHandImage={aiLeftHandImage}
        aiRightHandImage={aiRightHandImage}
        handToRemove={handToRemove}
        aiHandToRemove={aiHandToRemove}
      />
      <Controls
        selectedLeftHand={selectedLeftHand}
        selectedRightHand={selectedRightHand}
        executeMinusOne={executeMinusOne} // Pass state to Controls
        handToRemove={handToRemove}
      />
      {showTimer && <div className="make-choice-text">{screenText}</div>}
      <TimerBar showTimer={showTimer} />
    </div>
  );
}

export default GameScreen;