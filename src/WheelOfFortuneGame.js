import wheelImage from './wheel.png';
import AudioController from './AudioController';
import './App.css';
import React, { useState, useEffect } from 'react';

function WheelOfFortuneGame() {
  const [numOfGuessesAllowed, setNumOfGuessesAllowed] = useState(0);
  const [phrase, setPhrase] = useState('');
  const [hiddenPhrase, setHiddenPhrase] = useState('');
  const [numOfGuess, setNumOfGuess] = useState(0);
  const [numOfIncorrect, setNumOfIncorrect] = useState(0);
  const [userGuess, setUserGuess] = useState('');
  const [userEnteredGuesses, setUserEnteredGuesses] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState([]);

  useEffect(() => {
    setNumOfGuessesAllowed(10);
    fetchRandomPhrase();
  }, []);

  const fetchRandomPhrase = () => {
    const phrases = ['Change the world from here', 'Be the change you wish to see', 'Wheel of Fortune','Turn your wounds into wisdom'];
    const randomIndex = Math.floor(Math.random() * phrases.length);
    const randomPhrase = phrases[randomIndex];

    setPhrase(randomPhrase);
    setHiddenPhrase(generateHiddenPhrase(randomPhrase));
    setGuessedLetters([]);
  };

  const generateHiddenPhrase = (phrase) => {
    return phrase.replace(/[a-zA-Z]/g, '*');
  };

  const handleGuess = () => {
    if (!userGuess.match(/[a-zA-Z]/)) {
      alert('You should guess a letter.');
      return;
    }

    if (!userGuess.match(/^[a-zA-Z]$/)) {
      alert('You should guess only ONE letter each time');
      return;
    }

    if(guessedLetters.includes(userGuess.toUpperCase())){
      alert('You have already guessed this letter before');
      return;
    }

    // if(!phrase.includes(userGuess.toLowerCase())){
    //   alert('Wrong letter');
    //   return;
    // }

    if (!userGuess) {
      alert('Please enter a letter');
      return;
    }

    const updatedHiddenPhrase = hiddenPhrase.split('');
    let hasCorrectGuess = false;

    setGuessedLetters(prevGuessedLetters => [...prevGuessedLetters, userGuess.toUpperCase()]);

    for (let i = 0; i < phrase.length; i++) {
      if (phrase[i].toLowerCase() === userGuess.toLowerCase()) {
        updatedHiddenPhrase[i] = phrase[i];
        hasCorrectGuess = true;
      }
    }

    setHiddenPhrase(updatedHiddenPhrase.join(''));

    if (hasCorrectGuess) {
      setScore(score + 10); // 猜对一个字母加10分
    } else {
      setScore(score - 1); // 猜错扣1分
      alert('Wrong Guess');
      setNumOfIncorrect(numOfIncorrect + 1);
    }

    setNumOfGuess(numOfGuess + 1);
    setUserGuess('');

    if (numOfGuess === numOfGuessesAllowed - 1 || updatedHiddenPhrase.join('') === phrase) {
      checkWinLoss(hasCorrectGuess);
    }
  };

  const checkWinLoss = (hasCorrectGuess) => {
    if (hiddenPhrase === phrase) {
      setScore(score + (numOfGuessesAllowed - numOfGuess) * 5); // 每剩余一次猜测加5分
    }
    setGameOver(true);
  };

  const handleNumOfGuessesChange = (e) => {
    setNumOfGuessesAllowed(parseInt(e.target.value));
  };

  const startGame = () => {
    setUserEnteredGuesses(true);
    setGameOver(false);
    fetchRandomPhrase();
    setNumOfGuess(0);
    setNumOfIncorrect(0);
    setScore(0); 
  };

  const promptRestartGame = () => {
    const wantToRestart = window.confirm('Game Over! Do you want to play another round of Wheel of Fortune?');
    if (wantToRestart) {
      restartGame();
    } else {
      setUserEnteredGuesses(false);
      setNumOfGuess(0);
      setNumOfIncorrect(0);
      setScore(0);
    }
  };

  const restartGame = () => {
    setNumOfGuess(0);
    setNumOfIncorrect(0);
    setUserEnteredGuesses(false);
    fetchRandomPhrase();
    setGameOver(false);
    setScore(0);
    setGuessedLetters([]);
  };

  const purchaseExtraGuesses = () => {
    const confirmPurchase = window.confirm('Do you want to purchase 3 extra guesses? Share this game with your friends to unlock!');
    if (confirmPurchase) {

      const gameUrl = window.location.href; 
      const dummyElement = document.createElement('textarea');
      document.body.appendChild(dummyElement);
      dummyElement.value = gameUrl;
      dummyElement.select();
      document.execCommand('copy');
      document.body.removeChild(dummyElement);
      alert('Game URL copied to clipboard. Share it with your friends to get 3 extra guesses!');
      // suppose the user has shared the link
      setNumOfGuessesAllowed(prevNumOfGuessesAllowed => prevNumOfGuessesAllowed + 3);
    }
  };

  return (
    <div className="WheelOfFortuneGame">
      <header>
        <h1>Wheel of Fortune</h1>
      </header>
      <AudioController audioFile="https://dl.vgmdownloads.com/soundtracks/super-mario-bros.-the-30th-anniversary/weknekelam/1-01.%20Ground%20BGM%20-%20Super%20Mario%20Bros..mp3" />
      <div className="wheel-container">
        <img src={wheelImage} alt="Wheel of Fortune" />
      </div>
      {userEnteredGuesses ? (
        <>
          <div className="phrase-display">The phrase is: {phrase}</div>
          <div className="hidden-phrase-display">Hidden Phrase: {hiddenPhrase}</div>
          <div className="input-container">
            <input
              type="text"
              placeholder="Enter  a  letter"
              value={userGuess}
              onChange={(e) => setUserGuess(e.target.value)}
            />
            <button onClick={handleGuess}>Guess</button>
            <button onClick={purchaseExtraGuesses}>Purchase 3 Extra Guesses</button>
          </div>
          <div className="scoreboard">
            <p>Score: {score}</p>
            <p>Number of Guesses Allowed: {numOfGuessesAllowed}</p>
            <p>Number of Incorrect Guesses: {numOfIncorrect}</p>
            <p>Number of Guesses Remaining: {numOfGuessesAllowed - numOfGuess}</p>
          </div>
          {gameOver && (
            <div className="game-over-message">
              {hiddenPhrase === phrase ? (
                <h2 className="congrats-info">Congratulations! You Win!!</h2>
              ) : (
                <h2>Game Over. The correct phrase was: {phrase}. You missed {numOfIncorrect} times.</h2>
              )}
              <p>Your final score is: {score}</p>
              <button onClick={promptRestartGame}>Play Again</button>
            </div>
          )}
        </>
      ) : (
        <div className="start-container">
          <button onClick={startGame}>Start Game</button>
        </div>
      )}
      <footer>
        <p>CS514 - Web Game Project - Made by Junyu and Xueting</p>
      </footer>
    </div>
  );
}

export default WheelOfFortuneGame;