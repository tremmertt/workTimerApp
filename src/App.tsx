import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import playImg from './assets/playButton.png';
import resetImg from './assets/resetBtn.png';
import breakBtn from './assets/break.png';
import breakBtnClicked from './assets/break-clicked.png';
import workBtn from './assets/work.png';
import workBtnClicked from './assets/work-clicked.png';
import closeBtn from './assets/closebutton.png';
import meowSound from './assets/meow.mp3';
import idleGif from './assets/kikiWorking.gif';
import workGif from './assets/kikiFlying.gif';
import breakGif from './assets/breakTime.gif';
// import kikiMusic from 'https://on.soundcloud.com/Wz3A1I5n1wTFn4CF1e'

function App() {
  const [timeLeft, setTimeLeft] = useState(25*60);
  const [isRunning, setIsRunning] = useState(false);
  const [breakButtonImage, setBreakButtonImage] = useState(breakBtn);
  const [workButtonImage, setWorkButtonImage] = useState(workBtn);
  const [gifImage, setGifImage] = useState(idleGif);
  const [isBreak, setIsBreak] = useState(false);
  const [encouragement, setEncouragement] = useState('');
  const [playImage, setPlayImage] = useState(playImg);
  const meowAudio = new Audio(meowSound);

  const cheerMessages = [
    "Keep going",
    "Chase sunsets, not storms",
    "Smile: it's free therapy",
    "Believe you can and you're halfway there",
    "Progress, not perfection",
    "You are stronger than you think you are"
  ];

  const breakMessages = [
    "Take a break, you deserve it",
    "Quiet the mind, and the soul will speak",
    "Rest, recharge, and reflect",
    "Pause. Breathe. Reset.",
    "Focused action beats brilliance",
    "Unplug, recharge, and come back stronger"
  ];

  //Encouragment Messages Update
  useEffect(() => {
    let messageInterval: NodeJS.Timeout;
    if (isRunning) {
      const messages = isBreak ? breakMessages : cheerMessages;
      setEncouragement(messages[0]) // set first message initially
      let index = 1

      messageInterval = setInterval(() => {
        setEncouragement(messages[index]);
        index = (index + 1 ) % messages.length;
      }, 8000) // every 8 seconds
    } else {
      setEncouragement("");
    }

    return () => clearInterval(messageInterval);
  }, [isRunning, isBreak]);

  //Countdown timer 
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if(isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft( prev => prev - 1) 
      }, 1000); 
    } 
      return() => clearInterval(timer);
  }, [isRunning, timeLeft]);


  // Set initial switch mode to false
  useEffect(() => {
    switchMode(false);
  }, []);


  // meow Sound 
  useEffect(() => {
    if(timeLeft === 0 && isRunning) {
      meowAudio.play().catch(err => {
        console.error("Audio play failed:", err)
      });
      setIsRunning(false);
      setGifImage(idleGif);
      setPlayImage(playImg);
      setTimeLeft(isBreak ? 5 * 60 : 25 * 60)
    }
  },[timeLeft]);

  const formatTime = (second: number) : string => {
    const m = Math.floor(second/60).toString().padStart(2, '0');
    const s = (second % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const switchMode = (breakMode: boolean) => {
    setIsBreak(breakMode);
    setIsRunning(false);
    setBreakButtonImage(breakMode ? breakBtnClicked : breakBtn);
    setWorkButtonImage(breakMode ? workBtn : workBtnClicked);
    setTimeLeft(breakMode ? 5*60 : 25*60);
    setGifImage(idleGif);
  }

  const handleClick = () => {
    if(!isRunning) {
      setIsRunning(true)
      setGifImage(isBreak ? breakGif : workGif);
      setPlayImage(resetImg)
    } else {
      setIsRunning(false);
      setTimeLeft(isBreak ? 5*60 : 25*60);
      setGifImage(idleGif);
      setPlayImage(playImg)
    }
  }

  const handleCloseClick = () => {
    if(window.electronAPI?.closeApp) {
      window.electronAPI.closeApp();
    } else {
      console.warn("Electron API not available")
    }
  }

  const containerClass = `home-container ${isRunning ? "background-break" : ""}`;

  return (
    <div className={containerClass} style={{position:'relative'}}>
      <div>
        <button className="closeBtn" onClick={handleCloseClick}> 
          <img src={closeBtn} alt="Close" />
        </button>
      </div>

      <div className="home-content">
        <div className="home-controls">
          <button className="image-buttons" onClick={() => switchMode(false)}>
            <img src={workButtonImage} alt="Work" />
          </button>
          <button className="image-buttons" onClick={() => switchMode(true)}>
            <img src={breakButtonImage} alt="Break" />
          </button>
        </div>

        <p className={`encouragement-text ${!isRunning ? "hidden" : ""}`}> {encouragement} </p>
        <h1 className="home-timer">{formatTime(timeLeft)}</h1>
        <img src={gifImage} alt="Timer Status" className='gif-image' />
        <button className='home-button' onClick={handleClick}>
          <img src={playImage} alt="" />
        </button>
      </div>
    </div>
  );
}

export default App;
