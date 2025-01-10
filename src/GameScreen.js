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
  const [playerScore, setPlayerScore] = useState(0); // Player score state
  const [aiScore, setAIScore] = useState(0); // AI score st
  const [winner, setWinner] = useState(null); // Winner state

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



  const determineWinner = () => {
    console.log("Determining winner...");
    console.log("Player Hand Removed:", handToRemove);
    console.log("AI Hand Removed:", aiHandToRemove);
    console.log("Player Selected Left Hand:", selectedLeftHand);
    console.log("Player Selected Right Hand:", selectedRightHand);
    console.log("AI Selected Left Hand:", aiSelectedLeftHand);
    console.log("AI Selected Right Hand:", aiSelectedRightHand);
  
    let resultText = "";
  
// Q - ROCK
// W - PAPER
// E - SCISSORS

// Case 1: Both players removed their left hands
if (handToRemove === "Q" && aiHandToRemove === "Q") {
  console.log("Both players removed their left hands.");
  // SINCE LEFT HAND HAS BEEN REMOVED FOR BOTH, WE WORK WITH THE RIGHT HAND FOR BOTH
  if (selectedRightHand === "A" && aiSelectedRightHand === "D") {
    // Player Rock, AI Scissors - Player Wins
    setPlayerScore((prev) => prev + 1);
    resultText = "Player wins! Rock beats Scissors.";
  } else if (selectedRightHand === "S" && aiSelectedRightHand === "A") {
    // Player Paper, AI Rock - Player Wins
    setPlayerScore((prev) => prev + 1);
    resultText = "Player wins! Paper beats Rock.";
  } else if (selectedRightHand === "D" && aiSelectedRightHand === "S") {
    // Player Scissors, AI Paper - Player Wins
    setPlayerScore((prev) => prev + 1);
    resultText = "Player wins! Scissors beats Paper.";
  } else if (selectedRightHand === aiSelectedRightHand) {
    // Tie - Same hand selected
    resultText = "It's a tie! Both players chose the same hand.";
  } else {
    // AI Wins
    setAIScore((prev) => prev + 1);
    if (aiSelectedRightHand === "A" && selectedRightHand === "D") {
      resultText = "AI wins! Rock beats Scissors.";
    } else if (aiSelectedRightHand === "S" && selectedRightHand === "A") {
      resultText = "AI wins! Paper beats Rock.";
    } else if (aiSelectedRightHand === "D" && selectedRightHand === "S") {
      resultText = "AI wins! Scissors beats Paper.";
    }
  }
}

  
// Case 2: Player removed left hand, AI removed right hand
if (handToRemove === "Q" && aiHandToRemove === "A") {
  console.log("Player removed left hand, AI removed right hand.");

  if (selectedRightHand === "A" && aiSelectedLeftHand === "E") {
    // Player Rock, AI Scissors - Player Wins
    setPlayerScore((prev) => prev + 1);
    resultText = "Player wins! Rock beats Scissors.";
  } else if (selectedRightHand === "S" && aiSelectedLeftHand === "Q") {
    // Player Paper, AI Rock - Player Wins
    setPlayerScore((prev) => prev + 1);
    resultText = "Player wins! Paper beats Rock.";
  } else if (selectedRightHand === "D" && aiSelectedLeftHand === "W") {
    // Player Scissors, AI Paper - Player Wins
    setPlayerScore((prev) => prev + 1);
    resultText = "Player wins! Scissors beats Paper.";
  } else if (selectedRightHand === "A" && aiSelectedLeftHand === "Q") {
    // Tie - Both choose Rock
    resultText = "It's a tie! Both chose Rock.";
  } else if (selectedRightHand === "S" && aiSelectedLeftHand === "W") {
    // Tie - Both choose Paper
    resultText = "It's a tie! Both chose Paper.";
  } else if (selectedRightHand === "D" && aiSelectedLeftHand === "E") {
    // Tie - Both choose Scissors
    resultText = "It's a tie! Both chose Scissors.";
  } else {
    // AI Wins
    setAIScore((prev) => prev + 1);
    if (aiSelectedLeftHand === "Q" && selectedRightHand === "D") {
      // AI Rock beats Player Scissors
      resultText = "AI wins! Rock beats Scissors.";
    } else if (aiSelectedLeftHand === "W" && selectedRightHand === "A") {
      // AI Paper beats Player Rock
      resultText = "AI wins! Paper beats Rock.";
    } else if (aiSelectedLeftHand === "E" && selectedRightHand === "S") {
      // AI Scissors beats Player Paper
      resultText = "AI wins! Scissors beats Paper.";
    }
  }
}
  
// Case 3: Player removed right hand, AI removed left hand
if (handToRemove === "A" && aiHandToRemove === "Q") {
  console.log("Player removed right hand, AI removed left hand.");

  if (selectedLeftHand === "Q" && aiSelectedRightHand === "D") {
    // Player Rock, AI Scissors - Player Wins
    setPlayerScore((prev) => prev + 1);
    resultText = "Player wins! Rock beats Scissors.";
  } else if (selectedLeftHand === "W" && aiSelectedRightHand === "A") {
    // Player Paper, AI Rock - Player Wins
    setPlayerScore((prev) => prev + 1);
    resultText = "Player wins! Paper beats Rock.";
  } else if (selectedLeftHand === "E" && aiSelectedRightHand === "S") {
    // Player Scissors, AI Paper - Player Wins
    setPlayerScore((prev) => prev + 1);
    resultText = "Player wins! Scissors beats Paper.";
  } else if (selectedLeftHand === "Q" && aiSelectedRightHand === "A") {
    // Tie - Both choose Rock
    resultText = "It's a tie! Both chose Rock.";
  } else if (selectedLeftHand === "W" && aiSelectedRightHand === "S") {
    // Tie - Both choose Paper
    resultText = "It's a tie! Both chose Paper.";
  } else if (selectedLeftHand === "E" && aiSelectedRightHand === "D") {
    // Tie - Both choose Scissors
    resultText = "It's a tie! Both chose Scissors.";
  } else {
    // AI Wins
    setAIScore((prev) => prev + 1);
    if (aiSelectedRightHand === "A" && selectedLeftHand === "E") {
      // AI Rock beats Player Scissors
      resultText = "AI wins! Rock beats Scissors.";
    } else if (aiSelectedRightHand === "S" && selectedLeftHand === "Q") {
      // AI Paper beats Player Rock
      resultText = "AI wins! Paper beats Rock.";
    } else if (aiSelectedRightHand === "D" && selectedLeftHand === "W") {
      // AI Scissors beats Player Paper
      resultText = "AI wins! Scissors beats Paper.";
    }
  }
} 
  
// Case 4: Both players removed their right hands
if (handToRemove === "A" && aiHandToRemove === "A") {
  console.log("Both players removed their right hands.");

  if (selectedLeftHand === "Q" && aiSelectedLeftHand === "E") {
    // Player Rock, AI Scissors - Player Wins
    setPlayerScore((prev) => prev + 1);
    resultText = "Player wins! Rock beats Scissors.";
  } else if (selectedLeftHand === "W" && aiSelectedLeftHand === "Q") {
    // Player Paper, AI Rock - Player Wins
    setPlayerScore((prev) => prev + 1);
    resultText = "Player wins! Paper beats Rock.";
  } else if (selectedLeftHand === "E" && aiSelectedLeftHand === "W") {
    // Player Scissors, AI Paper - Player Wins
    setPlayerScore((prev) => prev + 1);
    resultText = "Player wins! Scissors beats Paper.";
  } else if (selectedLeftHand === aiSelectedLeftHand) {
    // Tie - Both chose the same hand
    resultText = "It's a tie! Both players chose the same hand.";
  } else {
    // AI Wins
    setAIScore((prev) => prev + 1);
    if (aiSelectedLeftHand === "Q" && selectedLeftHand === "E") {
      // AI Rock beats Player Scissors
      resultText = "AI wins! Rock beats Scissors.";
    } else if (aiSelectedLeftHand === "W" && selectedLeftHand === "Q") {
      // AI Paper beats Player Rock
      resultText = "AI wins! Paper beats Rock.";
    } else if (aiSelectedLeftHand === "E" && selectedLeftHand === "W") {
      // AI Scissors beats Player Paper
      resultText = "AI wins! Scissors beats Paper.";
    }
  }
}

console.log("Result Text:", resultText);
setScreenText(resultText); // Update the screen text with the result
}

useEffect(() => {
  if (executeMinusOne && executeAIMinusOne) {
    determineWinner();
    if (playerScore >= 3) { 
      setWinner("Player");
     setExecuteMinusOne(false);
     setExecuteAIMinusOne(false);
      setPlayRound(false); // Stop further rounds
      setScreenText("Player Wins the Game!");
    } else if (aiScore >= 3) {
      setWinner("AI");
      setExecuteMinusOne(false);
     setExecuteAIMinusOne(false);
      setPlayRound(false); // Stop further rounds
      setScreenText("AI Wins the Game!");
    } else {
      // Restart the round
      setTimeout(() => {
        resetRound(); // Reset for the next round
      }, 2000); // 2-second delay before restarting
    }
  }
}, [executeMinusOne, executeAIMinusOne]);

  // Reset and start a new round
  const resetRound = () => {
    console.log("Resetting for the next round...");
    setExecuteMinusOne(false);
    setExecuteAIMinusOne(false);
    setHandToRemove(null);
    setAIHandToRemove(null);
    setScreenText("Make Your Choice");
    setPlayRound(false);
    startCountdown(); // Restart countdown for the new round
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

    // Countdown Function
    const startCountdown = () => {
      setCountdown(3); // Start countdown at 3
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev > 1) {
            return prev - 1; // Decrement countdown
          } else if (prev === 1) {
            clearInterval(countdownInterval); // Clear interval when countdown ends
            setCountdown("Go!");
            setTimeout(() => {
              setCountdown(null); // Hide "Go!" after 1 second
              setPlayRound(true); // Start the round
            }, 1000);
          }
          return prev;
        });
      }, 1000);
    };
  

  useEffect(() => {
    playMusic();
    startCountdown();
      //INITIALIZING USER CHOICE
      setSelectedLeftHand("Q");
      setSelectedRightHand("A");

  }, []);




  
  //HANDLING THE ROCK PAPER SCISSORS PLAYS
  useEffect(() => {
    //PLAYER PLAY
    if (playRound) {
      setShowTimer(true);
      setAnimateHands(true);
     
      setLeftHandImage(playerLeftHandImages[selectedLeftHand] || "/hands/left_lefthand_rock.png");
      setRightHandImage(playerRightHandImages[selectedRightHand] || "/hands/left_righthand_rock.png");

      setAnimateHands(false);
    }

    //AI PLAY
    if (playRound && !aiPlayed.current) {
      aiPlayed.current = true; // Ensure AI logic runs only once per round

      const aiLeftKey = generateAiChoice(["Q", "W", "E"]);
      const aiRightKey = generateAiChoice(["A", "S", "D"]);

      console.log("AI chose left: " + aiLeftKey)
      console.log("AI chose right: " + aiRightKey)

      setAISelectedLeftHand(aiLeftKey);
      setAISelectedRightHand(aiRightKey);

      setTimeout(() => {
      setAILeftHandImage(aiRightHandImages[aiRightKey]);
      setAIRightHandImage(aiLeftHandImages[aiLeftKey]);
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
            aiHandToRemoveFunction();
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

  const aiHandToRemoveFunction = () => {
    const aiHandToRemoveChoice = generateAiChoice(["Q", "A"]);
    setAIHandToRemove(aiHandToRemoveChoice); 
  }

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
      {handToRemove && aiHandToRemove && <div className="make-choice-text">{screenText}</div>}
      <TimerBar showTimer={showTimer} />
    </div>
  );
}

export default GameScreen;