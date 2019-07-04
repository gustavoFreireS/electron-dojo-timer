import React, { useState, useEffect } from 'react';
import moment from 'moment';
import '../../stylesheets/timer.scss';


const Timer = () => {
  const ONE_SECOND = 1000;
  const THRESHOLD = 5 * 60 * ONE_SECOND;

  const [currentState, setCurrentState] = useState('stopped');
  const [counter, setCounter] = useState(THRESHOLD);

  const play = () => {
    setCurrentState('playing');
  }

  const stop = () => {
    setCounter(THRESHOLD);
    setCurrentState('stopped');
  }

  const pause = () => {
    setCurrentState('paused');
  }

  useEffect(() => {
    var timerID = setInterval(() => tick(), ONE_SECOND);

    return function cleanup() {
      clearInterval(timerID);
    };
  });

  function tick() {
    if (currentState === 'playing') {
      setCounter(counter - ONE_SECOND);
    }
  }

  if (currentState === 'playing' && counter === 0) {
    setCurrentState('ended');
    setCounter(THRESHOLD);
  }

  return (
    <div className="timer__container">
      <div className="timer__stopwatch">
        {currentState === 'ended' && 'TIMEOVER'}
        {currentState !== 'ended' && moment.utc(counter).format('mm:ss')}
      </div>
      <div className="timer__actions">
        {(currentState === 'stopped' || currentState === 'paused' || currentState === 'ended') && (
          <button type="button" className="timer__button timer__button--play" onClick={play}><i className="fa fa-play" /></button>
        )}
        {currentState === 'playing' && (
          <button type="button" className="timer__button timer__button--pause" onClick={pause}><i className="fa fa-pause" /></button>
        )}
        {(currentState === 'paused'|| currentState === 'playing') && (
          <button type="button" className="timer__button timer__button--stop" onClick={stop}><i className="fa fa-stop" /></button>
        )}
        <button className="timer__button timer__button--test"><i className="fa fa-bolt" /></button>
      </div>
    </div>
  );
};


export default Timer;
