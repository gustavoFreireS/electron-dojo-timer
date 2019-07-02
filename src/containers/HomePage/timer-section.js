import React, { useState, useEffect } from 'react';
import moment from 'moment';
import '../../stylesheets/timer.scss';

const Timer = () => {
  const [currentState, setCurrentState] = useState('stopped');
  const [duration, setDuration] = useState(0);

  const play = () => {
    setCurrentState('playing')
  }

  const stop = () => {
    setDuration(0)
    setCurrentState('stopped')
  }

  const pause = () => {
    setCurrentState('paused')
  }

  useEffect(() => {
    var timerID = setInterval( () => tick(), 1000 );
   
    return function cleanup() {
      clearInterval(timerID);
    };
  });

  function tick() {
    if (currentState === 'playing') { 
      setDuration(duration + 1000)
    }
  }

  if (currentState === 'playing' && duration >= 15 * 60 * 60 * 1000) {
    setCurrentState('ended')
    setDuration(0)
  }

  return (
    <div className="timer__container">
      {currentState === 'ended' && (
        <p>TIME OVER</p>
      )}
      {currentState !== 'ended' && (
        <p>{moment.utc(duration).format('HH:mm:ss')}</p>
      )}
      <div className="button__section">
        {(currentState === 'stopped' || currentState === 'paused' || currentState === 'ended') && (
          <button type="button" onClick={play}><i className="fa fa-play" /></button>
        )}
        {currentState === 'playing' && (
          <button type="button" onClick={pause}><i className="fa fa-pause" /></button>
        )}
        {(currentState === 'paused'|| currentState === 'playing') && (
          <button type="button" onClick={stop}><i className="fa fa-stop" /></button>
        )}
        <button className="testButton">Run Tests</button>
      </div>
    </div>
  );
};


export default Timer;